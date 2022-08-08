import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectRedirect, setRedirect } from "./meta";

const CommonLogicComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const redirect = useSelector(selectRedirect);

    useEffect(() => {
        if(redirect){
            dispatch(setRedirect(''));
            navigate(redirect);
        }
    },[dispatch, redirect, navigate]);

    return null;
};

export default CommonLogicComponent