import React, { useEffect, useState } from "react";
import axiosInstance from '../../services/authService';
import BigButton from "../Buttons/BigButton";
import ErrorMessage from '../../components/Map/ErrorMessage/ErrorMessage';

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

const AdminDashboard: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [newRuleName, setNewRuleName] = useState<string>('');

    const [error, setError] = useState<string>('');

    const [newRuleName, setNewRuleName] = useState<string>('');
    const [newRuleTypes, setNewRuleTypes] = useState<string[]>([]);

    const fetchRules = () => {
        axiosInstance.get('/generation_rules')
            .then(response => {
                setRules(response.data.data);
            }).catch (error => {
                console.error('Error fetching rules:', error);
                setError('Error fetching rules');
            });
    }

    useEffect(() => {
        fetchRules();
    }, []);

    const handleAddRule = async () => {
        try {
            axiosInstance.post('/generation_rules', {
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
            axiosInstance.delete(`/generation_rules/${id}`)
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
        </div>
    );
};

export default AdminDashboard;
