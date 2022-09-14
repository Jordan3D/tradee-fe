import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import './index.less';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// TODO
// - error handling refactor 3
// - tag filter (fe, be)
// - note filter (fe, be)
// - order trade and transaction by name (fe, be)
// - order trade and transaction by createDate (fe, be)
// - next feature : Trader Diary (Calendar, Day, display all trades within customized "dayStart" and "dayEnd", editable content, and two set : "read", "edit")