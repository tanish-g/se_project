import logo from './logo.svg';
import './App.css';
import SearchPreRegisteredStudents from './SearchPreRegisteredStudents';
import ViewStudentDetails from './ViewStudentDetails';
import SearchFinalRegisteredStudents from './SearchFinalRegisteredStudents';

function App() {
  return (
    <div className="App">
      {/* <SearchPreRegisteredStudents /> */}
      {/* <ViewStudentDetails /> */}
      <SearchFinalRegisteredStudents />
    </div>
  );
}

export default App;
