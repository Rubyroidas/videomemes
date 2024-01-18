import {Link} from 'react-router-dom';

export const HomePage = () => (
    <div>
        Home
        <Link to="/edit-scenario">edit scenario</Link>
        <Link to="/edit-phrases">edit phrases</Link>
    </div>
);
