import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const load = () => api.get('/admin/users').then(r => setUsers(r.data.data.users));
  useEffect(() => { load(); }, []);
  const toggle = async (id: string) => { await api.patch(`/admin/users/${id}/block`); load(); };
  return (
    <div><h1 className="text-2xl mb-4">Users</h1>
      <table className="w-full text-sm"><thead className="text-left border-b"><tr><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
        <tbody>{users.map(u=>(
          <tr key={u._id} className="border-b"><td className="py-2">{u.name}</td><td>{u.email}</td><td>{u.role}</td>
          <td>{u.blocked?'Blocked':'Active'}</td>
          <td><button onClick={()=>toggle(u._id)} className="text-accent">{u.blocked?'Unblock':'Block'}</button></td></tr>
        ))}</tbody></table>
    </div>
  );
}
