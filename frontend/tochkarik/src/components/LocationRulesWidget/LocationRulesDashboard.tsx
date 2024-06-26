import React, {useEffect, useState} from 'react';
import axiosInstance from '../../services/authService';

import ViewModal from './ViewModal'
import {setAuthToken} from "../../hooks/axiosConfig";


const LocationRulesDashboard: React.FC = () => {
    const [rules, setRules] = useState([]); // TODO add default values if backend not response
    const [selectedRule, setSelectedRule] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchRules = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            setAuthToken(token);
        }
        try {
            const response = await axiosInstance.get('/generation_rules');
            console.log(response.data.data);
            setRules(response.data.data);
        } catch (error) {
            console.error('Error fetching rules:', error);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    fetch

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/generation_rules/${id}`);
            setRules(rules.filter(rule => rule.id !== id));
        } catch (error) {
            console.error('Error deleting rule:', error);
        }
    };

    const handleEdit = (id: number) => {
        // Implement edit logic here
        console.log(`Edit rule with id: ${id}`);
    };

    const handleView = (rule: any) => { // TODO: add props params to rule
        setSelectedRule(rule);
        setShowModal(true);
    };

    return (
        <div>
            <h2>Generation Rules Dashboard</h2>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Rules</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {rules.length > 0 & rules.map(rule => (
                    <tr key={rule.id}>
                        <td>{rule.name}</td>
                        <td>{rule.rules.type.map((type: string, index: number) => (
                            <span key={index}>{type}{index < rule.rules.type.length - 1 ? ', ' : ''}</span>
                        ))}</td>
                        <td>
                            <button onClick={() => handleView(rule)}>View</button>
                            <button onClick={() => handleEdit(rule.id)}>Edit</button>
                            <button onClick={() => handleDelete(rule.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedRule && (
                <ViewModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    rule={selectedRule}
                />
            )}
        </div>
    );
};

export default LocationRulesDashboard;
