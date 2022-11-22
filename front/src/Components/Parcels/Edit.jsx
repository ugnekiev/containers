import { useState, useContext, useRef, useEffect } from 'react';
import DataContext from '../../Contexts/DataContexts';
import Parcels from '../../Contexts/Parcels';
import getBase64 from '../../Functions/getBase64';

function Edit() {

    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [container, setContainer] = useState(0);
    const [flamable, setFlamable] = useState(false);
    const [expiration, setExpiration] = useState(false);
    const fileInput = useRef();
    const [deletePhoto, setDeletePhoto] = useState(false);

    const { setEditData, modalData, setModalData, containers } = useContext(Parcels);
    const { makeMsg } = useContext(DataContext);

    const [photoPrint, setPhotoPrint] = useState(null);

    const doPhoto = () => {
        getBase64(fileInput.current.files[0])
            .then(photo => setPhotoPrint(photo))
            .catch(_ => {
                // tylim
            });
    };

    const edit = () => {
        if (name.length === 0 || name.length > 50) {
            makeMsg('Invalid title', 'error');
            return;
        }
        if (weight.replace(/[^\d.]/, '') !== weight) {
            makeMsg('Invalid weight', 'error');
            return;
        }
        if (parseFloat(weight) > 999.99) {
            makeMsg('Max weight is 999.99', 'error');
            return;
        }
        setEditData({
            name,
            weight: parseFloat(weight),
            image: photoPrint,
            deletePhoto: deletePhoto ? 1 : 0,
            flamable: flamable ? 1 : 0,
            expiration: expiration ? 1 : 0,
            container_id: JSON.parse(container).id
        });
        setModalData(null);
        setDeletePhoto(false);
    }

    useEffect(() => {
        if (null === modalData) {
            return;
        }
        setName('');
        setWeight('');
        setPhotoPrint(null);
        setDeletePhoto(false);
        fileInput.current.value = null;
        setFlamable(false);
        setExpiration(false);
        setContainer(0)
    }, [modalData])


if (null === modalData) {
    return null;
}
console.log(containers)

return (
    <div className="modal">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Edit Parcel</h5>
                    <button
                        onClick={() => setModalData(null)}
                        type="button"
                        className="btn-close"
                    ></button>
                </div>
                <div className="modal-body">
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Weight</label>
                            <input maxLength={5} type="text" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Parcel Image</label>
                            <input ref={fileInput} type="file" className="form-control" onChange={doPhoto} />
                        </div>
                        {photoPrint ? <div className='img-bin'><img src={photoPrint} alt="upload"></img></div> : null}
                        <div className="mb-3">
                            <label className="form-label">Is it flammable?</label>
                            <input type="Checkbox" checked={flamable} value={flamable} onChange={() => setFlamable(e => !e)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Is it expiration?</label>
                            <input type="Checkbox" checked={expiration} value={expiration} onChange={() => setExpiration(e => !e)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Select container size</label>
                            <select className="form-select" value={containers} onChange={e => setContainer(e.target.value)}>
                                <option>
                                    {containers}
                                </option>
                            </select>

                        </div>

                    </div>
                    <button onClick={edit} type="button" className="btn btn-outline-success">Save</button>
                </div>
            </div>
        </div>
    </div>
);
}

export default Edit;