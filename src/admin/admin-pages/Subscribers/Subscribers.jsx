import { useEffect, useState } from "react";
import "./Subscribers.css";
import { getAdminSubscribers } from "../../../utils/adminStorage";

export default function Subscribers() {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        setEmails(getAdminSubscribers());
    }, []);

    return (
        <div className="admin-subscribers-page">
            <div className="admin-subscribers-header">
                <h2>Subscribers ({emails.length})</h2>
            </div>

            {emails.length === 0 ? (
                <p className="admin-subscribers-empty">No subscribers yet.</p>
            ) : (
                <table className="admin-subscribers-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emails.map((email, index) => (
                            <tr key={email}>
                                <td>{index + 1}</td>
                                <td>{email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
