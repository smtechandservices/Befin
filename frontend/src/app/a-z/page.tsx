import React from 'react';
import dynamic from 'next/dynamic';

const AZGameApp = dynamic(() => import('../../a-z-components/App.jsx'));

export default function AZGameWrapper() {
    return (
        <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
            <AZGameApp />
        </div>
    );
}
