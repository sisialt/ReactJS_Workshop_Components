import Search from '../search/Search';
import Pagination from '../pagination/Pagination';
import UserList from './user-list/UserList';
import UserAdd from './user-add/UserAdd';
import { useEffect, useState } from 'react';
import UserDelete from './user-delete/UserDelete';
import UserDetails from './user-details/UserDetails';

const baseUrl = 'http://localhost:3030/jsonstore';

export default function UserSection() {
    const [addUser, setAddUser] = useState(false);
    const [users, setUsers] = useState([]);
    const [deleteUser, setDeleteUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [details, setDetails] = useState(false);

    useEffect(() => {
        async function getUsers() {
            const response = await fetch(`${baseUrl}/users`);
            const data = await response.json();
            const userData = Object.values(data);
            setUsers(userData);
        }
        getUsers();
    }, []);

    const showAddUser = () => {
        setAddUser(true);
    }

    const closeAddUser = () => {
        setAddUser(false);
    }

    const showDeleteUser = () => {
        setDeleteUser(true);
    }

    const closeDeleteUser = () => {
        setDeleteUser(false);
    }

    const changeSelectedUser = (u) => {
        setSelectedUser(u)
    }

    const showDetails = () => {
        setDetails(true);
    }

    const closeDetails = () => {
        setDetails(false);
    }

    const saveAddUser = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const entries = Object.fromEntries(formData);

        const userData = {
            firstName: entries.firstName,
            lastName: entries.lastName,
            email: entries.email,
            phoneNumber: entries.phoneNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imageUrl: entries.imageUrl,
            address: {
                country: entries.country,
                city: entries.city,
                street: entries.street,
                streetNumber: entries.streetNumber,
            },
        };

        const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const createdUser = await response.json();

        setUsers(oldUsers => [...oldUsers, createdUser]);

        setAddUser(false);
    }

    const deleteUserHandler = async (user) => {
        const response = await fetch(`${baseUrl}/users/${user._id}`, {
            method: 'DELETE'
        })

        setUsers(oldUsers => oldUsers.filter(u => u._id !== user._id))

        closeDeleteUser();
    } 

    return (
        <>
            <section className="card users-container">
            
                <Search />

                <UserList 
                    users={users}
                    onDelete={showDeleteUser}
                    onChangeSelectedUser={changeSelectedUser}
                    onDetails={showDetails}
                />

                {addUser && (
                    <UserAdd 
                        onClose={closeAddUser}
                        onSave={saveAddUser}
                    />
                )}

                {deleteUser && 
                    <UserDelete 
                        onClose={closeDeleteUser}
                        onDelete={() => deleteUserHandler(selectedUser)}
                    />
                }

                {details && 
                    <UserDetails 
                        user={selectedUser}
                        onClose={closeDetails}
                    />
                }

                <button className="btn-add btn" onClick={showAddUser}>Add new user</button>

                <Pagination />

            </section>
        </>
    );
}