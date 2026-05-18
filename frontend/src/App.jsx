import { Router, Routes } from "react-router-dom";

const stats = [
  { label: 'Routes wired', value: '2 auth areas' },
  { label: 'Stack', value: 'React + Vite' },
  { label: 'Backend ready', value: 'MongoDB + Express' }
];

const App = () => {
return (
    <div>
        <Routes>
        <Route path="/" element={<Home />} />
        </Routes>
          
    </div>
)
}

export default App;