import React, { useState, useEffect } from 'react';
import './App.css';
import stateList from './data/state.json'

function App() {
  const [type, setType] = useState(null);
  const [state, setState] = useState(null);
  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const onChangeType = (ev) => {
    setType(ev.target.value);
    setData(null);
    setSelectedItem(null);
  }

  const onChangeState = (ev) => {
    setState(ev.target.value);
    setData(null);
    setSelectedItem(null);
  }

  const onSelectItem = (item) => {
    setSelectedItem(item);
  }

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:5000/${type}/${state}`;
      let fetchedData = await fetch(url).then(res => res.json());
      setData(fetchedData.results);
    }
    if (type && state) {
      fetchData();
    }
  }, [type, state])

  
  return (
    <div className="App">
      <div className='select-section'>
        <select className='type select-ctrl d-block' onChange={onChangeType}>
          <option value=''>Please select type</option>
          <option value='representatives'>Representatives</option>
          <option value='senators'>Senators</option>
        </select>

        <select className='state select-ctrl d-block mt-2' onChange={onChangeState}>
          <option value=''>Please select state</option>
          {
            stateList &&
            stateList.map((item, index) => (
              <option value={item?.abbreviation} key={index}>{item?.abbreviation}: {item?.name}</option>
            ))
          }
        </select>
      </div>

      <section className='row mt-5 info-section m-auto'>
        <div className='col-sm-8'>
          <div className='h4 text-start'>List / <span className='text-capitalize text-primary'>{type}</span></div>
          <table className="table">
            <thead>
              <tr className='table-header'>
                <th scope="col" className='text-start'>Name</th>
                <th scope="col" className='text-start' style={{ width: 150 }}>Part</th>
              </tr>
            </thead>
            <tbody>
              {
                data &&
                data.map((item, index) => (
                  <tr key={index} onClick={() => onSelectItem(item)} className={`${item === selectedItem ? 'sel-tr' : ''}`}>
                    <td align='left'>{item.name}</td>
                    <td align='left'>{item.party}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div className='col-sm-4'>
          <div className='h4 text-start'>Info</div>
          {
            <div className='justify-left'>
              <input className='d-block w-100 mt-2 info-input' type='text' placeholder='First Name' defaultValue={selectedItem?.name.split(' ')[0] ?? ''} />
              <input className='d-block w-100 mt-3 info-input' type='text' placeholder='Last Name' defaultValue={selectedItem?.name.split(' ')[1] ?? ''} />
              <input className='d-block w-100 mt-3 info-input' type='text' placeholder='District' defaultValue={selectedItem?.district ?? ''} />
              <input className='d-block w-100 mt-3 info-input' type='text' placeholder='Phone' defaultValue={selectedItem?.phone ?? ''} />
              <input className='d-block w-100 mt-3 info-input' type='text' placeholder='Office' defaultValue={selectedItem?.office ?? ''} />
            </div>
          }
        </div>
      </section>

    </div>
  );
}

export default App;
