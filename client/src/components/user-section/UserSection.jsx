import Search from '../search/Search';
import Pagination from '../pagination/Pagination';
import UserList from './user-list/UserList';
import UserAdd from './user-add/UserAdd';
import { useState } from 'react';

export default function UserSection() {
    const [addUser, setAddUser] = useState(false);

    const showAddUser = () => {
        setAddUser(true);
    }

    const closeAddUser = () => {
        setAddUser(false);
    }

    return (
        <>
            <section className="card users-container">
            
                <Search />

                <UserList />

                {addUser && (
                    <UserAdd 
                        onClose={closeAddUser}
                    />
                )}

                <button className="btn-add btn" onClick={showAddUser}>Add new user</button>

                <Pagination />

            </section>
        </>
    );
}