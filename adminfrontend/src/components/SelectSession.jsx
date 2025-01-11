import React, { useEffect, useState } from 'react';
import CreateNewSession from './CreateNewSession';
import axios from 'axios';
import { HOST } from './constants';

export default function SelectSession({setSession}) {
    const [resultSession, setResultSession] = useState([]);
    const [viewCreateNewSession, setViewCreateNewSession] = useState(false);
    const [selectedSession, setSelectedSession] = useState("Create New Session");

    const getSessionData = async () => {
        try {
            const response = await axios.get(`${HOST}/getSessions`);
            const data = response.data;
            setResultSession(data.sessions);
            console.log('Axios Data:', data.sessions); // Log the response data
            // Set the default selected session if there is data
            if (data.sessions.length > 0) {
                setSelectedSession(data.sessions[0]);
                setSession(data.sessions[0]);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                console.error('Status Code:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Axios Error:', error.message);
            }
        }
    };

    useEffect(() => {
        getSessionData();
    }, [viewCreateNewSession]);

    const handleSelect = (e) => {
        const selectedValue = e.target.value;
        setSelectedSession(selectedValue);
        setSession(selectedValue);
        if (selectedValue === "Create New Session") {
            setViewCreateNewSession(true);
        }
    };

    if (viewCreateNewSession) {
        return (
            <CreateNewSession
                viewCreateNewSession={viewCreateNewSession}
                setViewCreateNewSession={setViewCreateNewSession}
            />
        );
    }

    return (
        <select
            style={{
                width: '300px',
                height: '40px',
                fontSize: '25px',
                textAlign: 'center',
                borderRadius: '30px',
                position:'absolute',
                top:'100px'
            }}
            value={selectedSession}  // Bind to state to manage selected value
            onChange={handleSelect}
        >
            {resultSession.map((session, index) => (
                <option key={index} value={session}>
                    {session}
                </option>
            ))}
            <option value="Create New Session">Create New Session</option>
        </select>
    );
}
