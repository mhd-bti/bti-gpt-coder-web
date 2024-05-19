import React, { useState } from 'react';

const Test = () => {
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [confirmation, setConfirmation] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value);
    };

    const handleConfirmation = () => {
        setConfirmation(true);
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    return (
        <div>
            {!confirmation && !submitted && (
                <div>
                    <label>Address:</label>
                    <input type='text' value={address} onChange={handleAddressChange} />
                    <br />
                    <label>Name:</label>
                    <input type='text' value={name} onChange={handleNameChange} />
                    <br />
                    <label>Age:</label>
                    <input type='number' value={age} onChange={handleAgeChange} />
                    <br />
                    <button onClick={handleConfirmation}>Confirm</button>
                </div>
            )}
            {confirmation && !submitted && (
                <div>
                    <p>Confirm Address: {address}</p>
                    <p>Confirm Name: {name}</p>
                    <p>Confirm Age: {age}</p>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            )}
            {submitted && (
                <div>
                    <h2>Thank you for submitting!</h2>
                    <p>Address: {address}</p>
                    <p>Name: {name}</p>
                    <p>Age: {age}</p>
                </div>
            )}
        </div>
    );
};

export default Test;

