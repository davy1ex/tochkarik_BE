import React, { useEffect, useState } from "react";
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
    rules: { type: string[] };
}

const locationTypes = [
    { value: 'mall', label: 'Mall' },
    { value: 'supermarket', label: 'Supermarket' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'park', label: 'Park' },
];

interface AnalyticsData {
    totalGeneratedPoints: number;
    generatedByRule: number;
    generatedWithoutRule: number;
    totalVisitedPoints: number;
    visitedByRule: number;
    visitedWithoutRule: number;
    visitRateByRule: number;
}

const AdminDashboard: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [newRuleName, setNewRuleName] = useState<string>('');
    const [newRuleTypes, setNewRuleTypes] = useState<string[]>([]);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [error, setError] = useState<string>('');

    const fetchRules = async () => {
        axiosPublicInstance.get('/generation_rules')
            .then(response => {
                setRules(response.data.data);
            }).catch (error => {
                console.error('Error fetching rules:', error);
                setError('Error fetching rules');
            });
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
        try {
            axiosPrivateInstance.post('/generation_rules', {
                name: newRuleName,
                rules: { type: newRuleTypes }
            }).then(response => {
                setRules([...rules, response.data.data]);
                setNewRuleName('');
                setNewRuleTypes([]);
            });

        } catch (error) {
            console.error('Error adding rule:', error);
            setError('Error adding rule');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            axiosPrivateInstance.delete(`/generation_rules/${id}`)
                .then(response => {
                    setRules(rules.filter(rule => rule.id !== id));
                });
        } catch (error) {
            console.error('Error deleting rule:', error);
            setError('Error deleting rule');
        }
    };

    const handleTypeChange = (type: string) => {
        setNewRuleTypes(prevTypes =>
            prevTypes.includes(type)
                ? prevTypes.filter(t => t !== type)
                : [...prevTypes, type]
        );
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {error && <ErrorMessage message={error}/>}

            <div>
                <h3>Add New Rule</h3>
                <input
                    type="text"
                    placeholder="Rule Name"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                />
                <div>
                    {locationTypes.map(type => (
                        <label key={type.value}>
                            <input
                                type="checkbox"
                                value={type.value}
                                checked={newRuleTypes.includes(type.value)}
                                onChange={() => handleTypeChange(type.value)}
                            />
                            {type.label}
                        </label>
                    ))}
                </div>
                <BigButton onClick={handleAddRule}>Add Rule</BigButton>
            </div>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Rules</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {rules.map(rule => (
                    <tr key={rule.id}>
                        <td>{rule.id}</td>
                        <td>{rule.name}</td>
                        <td>{rule.rules.type.join(', ')}</td>
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
