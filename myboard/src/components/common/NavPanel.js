import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NavPanel = () => {

    const loginInfo = useSelector(state => state.member.login);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clickHandler = (identifier, event) => {
        event.preventDefault();
        if(identifier === 'logout') {
            dispatch({type: "MEMBER/LOGOUT"});
            alert("로그아웃 되었습니다.");
            navigate("/");
        }
    }

    return (
        <>
            <nav>
                <Link to={'/'}>Home</Link>
                <Link to={'/about'}>About</Link>
                <Link to={'/profile'}>Profile</Link>
                {
                    loginInfo.SEQ === null ?
                    <Link to={"/member/login"} className={"loginBtn"}><button>로그인</button></Link> :
                    <button onClick={e => clickHandler('logout', e)}>로그아웃</button>
                }
            </nav>
        </>
    );
};

export default NavPanel;