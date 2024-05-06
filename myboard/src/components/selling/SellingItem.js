import axios from 'axios';
import './SellingItem.css';
import { useNavigate } from 'react-router-dom';

/*
sell_id, title, money_code1, amount1, money_code2, amount2, region_name, write_date, latitude, longitude
changeMapState
*/
const SellingItem = (props) => {
    const navigate = useNavigate();
    const [parentMapState, setParentMapState] = props.changeMapState;
    const clickHandler = (identifier, event) => {
        event.preventDefault();
        if(identifier === 'detail') {
            navigate('/selling/detail', {state:{sell_id:props.sell_id}}); // useNavigate로 데이터 전달 후 useLocation 으로 전달한 데이터를 받을 수 있다.
        }
    }
    // const formData = new FormData();

    return (
        <><div className="div_selling_item"
                onClick={(e) => clickHandler('detail', e)}
                onMouseEnter={() => {setParentMapState({...parentMapState, marker : {lat : props.latitude, lng : props.longitude}});}}
                onMouseLeave={() => {setParentMapState({...parentMapState, marker : {lat : null, lng : null}});}}>
            <h3>{props.title}</h3>
            <div className="div_selling_item_amount1">판매금액 : {props.amount1} {props.money_code1}</div>
            <div className="div_selling_item_amount2">제시가격 : {props.amount2} {props.money_code2}</div>
            <div className="div_selling_item_region_name">{props.region_name}</div>
            <div>{props.write_date}</div>
        </div></>
    );
};

export default SellingItem;