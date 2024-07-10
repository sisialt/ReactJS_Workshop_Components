import Search from '../search/Search';
import Pagination from '../pagination/Pagination';
import UserList from './user-list/UserList';
import UserAdd from './user-add/UserAdd';
import { useEffect, useState } from 'react';
import UserDelete from './user-delete/UserDelete';
import UserDetails from './user-details/UserDetails';
import UserEdit from './user-edit/UserEdit';

const baseUrl = 'http://localhost:3030/jsonstore';

export default function UserSection() {
    const [addUser, setAddUser] = useState(false);
    const [users, setUsers] = useState([]);
    const [deleteUser, setDeleteUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [details, setDetails] = useState(false);
    const [editUser, setEditUser] = useState(false);

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

    const showEditUser = () => {
        setEditUser(true);
    }

    const closeEditUser = () => {
        setEditUser(false);
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

        closeAddUser();
    }

    const deleteUserHandler = async (user) => {
        const response = await fetch(`${baseUrl}/users/${user._id}`, {
            method: 'DELETE'
        })

        setUsers(oldUsers => oldUsers.filter(u => u._id !== user._id))

        closeDeleteUser();
    } 

    const editUserHandler = async (u, e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const entries = Object.fromEntries(formData);

        const userData = {
            '_id': u._id,
            firstName: entries.firstName,
            lastName: entries.lastName,
            email: entries.email,
            phoneNumber: entries.phoneNumber,
            createdAt: u.createdAt,
            updatedAt: new Date().toISOString(),
            imageUrl: entries.imageUrl,
            address: {
                country: entries.country,
                city: entries.city,
                street: entries.street,
                streetNumber: entries.streetNumber,
            },
        };
        
        const response = await fetch(`${baseUrl}/users/${u._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        const editedUser = await response.json();

        setUsers(oldUsers => [...(oldUsers.filter(us => us._id !== u._id)), editedUser]);

        closeEditUser();
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
                    onEdit={showEditUser}
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

                {editUser && 
                    <UserEdit 
                        user={selectedUser}
                        onClose={closeEditUser}
                        onSave={(e) => editUserHandler(selectedUser, e)}
                    />
                }

                <button className="btn-add btn" onClick={showAddUser}>Add new user</button>

                <Pagination />

            </section>
        </>
    );
}