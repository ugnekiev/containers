import { useState, useEffect } from 'react';
import DataContext from '../../Contexts/DataContexts';
import Create from './Create';
import List from './List';
import axios from 'axios';
import Edit from './Edit';
// import { authConfig } from '../../Functions/auth';
import { useContext } from 'react';
import Containers from '../../Contexts/Containers';

function Main() {

    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [createData, setCreateData] = useState(null);
    const [containers, setContainers] = useState(null);
    const [deleteData, setDeleteData] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [editData, setEditData] = useState(null);
    const { makeMsg } = useContext(DataContext);

    // READ for list
    useEffect(() => {
        axios.get('http://localhost:3003/containers', ) //authConfig()
            .then(res => {
                setContainers(res.data);
            })
    }, [lastUpdate]);

    useEffect(() => {
        if (null === createData) {
            return;
        }
        axios.post('http://localhost:3003/containers', createData) //authConfig()
            .then(res => {
                setLastUpdate(Date.now());
                makeMsg(res.data.text, res.data.type);
            });
    }, [createData, makeMsg]);

    useEffect(() => {
        if (null === deleteData) {
            return;
        }
        axios.delete('http://localhost:3003/containers/' + deleteData.id)//authConfig()
            .then(res => {
                setLastUpdate(Date.now());
                makeMsg(res.data.text, res.data.type);
            });
    }, [deleteData, makeMsg]);

    useEffect(() => {
        if (null === editData) {
            return;
        }
        axios.put('http://localhost:3003/containers/' + editData.id, editData)//authConfig()
            .then(res => {
                setLastUpdate(Date.now());
                makeMsg(res.data.text, res.data.type);
            });
    }, [editData, makeMsg]);


    return (
        <Containers.Provider value={{
            setCreateData,
            containers,
            setDeleteData,
            modalData,
            setModalData,
            setEditData
        }}>
            <div className="container">
                <div className="row">
                    <div className="col col-lg-4 col-md-12">
                        <Create />
                    </div>
                    <div className="col col-lg-8 col-md-12">
                        <List />
                    </div>
                </div>
            </div>
            <Edit />
        </Containers.Provider>
    )
}
export default Main;