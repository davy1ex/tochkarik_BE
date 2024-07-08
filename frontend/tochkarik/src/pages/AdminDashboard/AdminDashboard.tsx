import { FC, useEffect, useState } from "react";
import { setAuthToken } from '../../services/authService';
import { axiosPrivateInstance } from '../../services/authService';
import { axiosPublicInstance } from '../../services/authService';

import BigButton from "../../components/Buttons/BigButton";
import ErrorMessage from '../../components/Map/ErrorMessage/ErrorMessage';

import './AdminDashboard.css'
import '../../components/InputField/InputField.css'

interface Rule {
    id: number;
    name: string;
    coordinates: { type: [number, number] };
    radius: number;
}

interface AnalyticsData {
    totalGeneratedPoints: number;
    generatedByRule: number;
    generatedWithoutRule: number;
    totalVisitedPoints: number;
    visitedByRule: number;
    visitedWithoutRule: number;
    visitRateByRule: number;
}

const AdminDashboard: FC = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [newRuleName, setNewRuleName] = useState<string>('');
    const [latitude, setLatitude] = useState<number | string>();
    const [longitude, setLongitude] = useState<number | string>();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [radius, setRadius] = useState<number | string>('');
    const [error, setError] = useState<string>('');

    const fetchRules = async () => {
        try {
            const response = await axiosPublicInstance.get('/generation_rules');

            if (Array.isArray(response.data.data)) {
                setRules(response.data.data);
            } else {
                setRules([]);
            }
        } catch (error) {
            setError('Error fetching rules');
        }
    }

    const fetchAnalytics = () => {
        try {
            axiosPrivateInstance.get('/point_telemetry_analytics')
                .then(response => {
                    setAnalyticsData(response.data.analytics);
                });
        } catch (error) {
            setError('Error fetching analytics data');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            setAuthToken(token);
            fetchAnalytics();
        }


        fetchRules();
    }, []);

    const handleAddRule = async () => {
        if (!newRuleName || !latitude || !longitude || !radius) {
            setError('All fields are required to add a new rule');
            return;
        }

        try {
            axiosPrivateInstance.post('/generation_rules', {
                name: newRuleName,
                coordinates: [latitude, longitude],
                radius: radius
            }).then(response => {
                setRules([...rules, response.data.data]);
                setNewRuleName('');
                setLongitude('')
                setLatitude('')
                setRadius('')
            });

        } catch (error) {
            console.error('Error adding rule:', error);
            setError('Error adding rule');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            axiosPrivateInstance.delete(`/generation_rules/${id}`)
                .then(() => {
                    setRules(rules.filter(rule => rule.id !== id));
                });
        } catch (error) {
            console.error('Error deleting rule:', error);
            setError('Error deleting rule');
        }
    };


    return (
        <div>
            <h2>Admin Dashboard</h2>
            {error && <ErrorMessage message={error}/>}

            <div>
                <h3>Add New Rule</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Radius"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                />
                <BigButton onClick={handleAddRule}>Add Rule</BigButton>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Coordinates</th>
                    <th>Radius</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {rules.length > 0 ? (
                    rules.map(rule => (
                        <tr key={rule.id}>
                            <td>{rule.name}</td>
                            <td>{rule.coordinates.join(', ')}</td>
                            <td>{rule.radius}</td>
                            <td>
                                <BigButton onClick={() => handleDelete(rule.id)}>Delete</BigButton>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4}>No rules found</td>
                    </tr>
                )}
                {rules.map(rule => (
                    <tr key={rule.id}>
                        <td>{rule.name}</td>
                        <td>{rule.coordinates.join(', ')}</td>
                        <td>{rule.radius}</td>
                        <td>
                            <BigButton onClick={() => handleDelete(rule.id)}>Delete</BigButton>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {analyticsData ? (
                <div className="analytics-container">
                    <div className={"analytics-container-header"}>
                        <h3>Analytics</h3>
                        <div className="analytics-item">
                            <span className="analytics-label">Total Generated Points: </span>
                            <span className="analytics-value">{analyticsData.totalGeneratedPoints}</span>
                        </div>

                        <div className="analytics-item">
                            <span className="analytics-label">Total Visited Points: </span>
                            <span className="analytics-value">{analyticsData.totalVisitedPoints}</span>
                        </div>
                    </div>

                    <div className={"analytics-container-body"}>
                        <div className={"analytics-container-half"}>
                            <h2>Generated:</h2>
                            <div className="analytics-item">
                                <span className="analytics-label"> by Rule: </span>
                                <span className="analytics-value">{analyticsData.generatedByRule}</span>
                            </div>
                            <div className="analytics-item">
                                <span className="analytics-label">without Rule: </span>
                                <span className="analytics-value">{analyticsData.generatedWithoutRule}</span>
                            </div>
                        </div>

                        <div className={"analytics-container-half"}>
                            <h2>Visited</h2>
                            <div className="analytics-item">
                                <span className="analytics-label">by Rule: </span>
                                <span className="analytics-value">{analyticsData.visitedByRule}</span>
                            </div>
                            <div className="analytics-item">
                                <span className="analytics-label">without Rule: </span>
                                <span className="analytics-value">{analyticsData.visitedWithoutRule}</span>
                            </div>
                        </div>
                    </div>
                    <div className="analytics-score">
                        <span className="analytics-label">Score: </span>
                        <span className="analytics-value">{analyticsData.visitRateByRule.toFixed(2)}%</span>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default AdminDashboard;
