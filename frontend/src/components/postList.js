import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PostList() {
    return (
        <body>
            <div className="container">
                <h3 className="header">APDS Notice Board</h3>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Caption</th>
                            <th>Image</th>
                            <th>Actions</th>    {/* Added column for Actions */}
                        </tr>
                    </thead>
                </table>
            </div>
        </body>
    );
}