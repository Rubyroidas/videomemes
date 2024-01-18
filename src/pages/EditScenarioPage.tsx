import {Link} from 'react-router-dom';
import {AppTitle} from '../components/App.styles';

export const EditScenarioPage = () => (
    <div>
        <Link to="/">go home</Link>
        <AppTitle>Edit scenario</AppTitle>
        <h1>Pick scenario</h1>
        <p>TODO</p>
        <p>or</p>
        <Link to="/edit-phrases">Edit from scratchs</Link>
    </div>
);
