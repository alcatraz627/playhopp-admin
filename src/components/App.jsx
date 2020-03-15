import React, { useState, useEffect } from 'react'
import zipObject from 'lodash/zipObject'
import axios from 'axios'

import { API_ROOT } from '../constants'
import { _tabKeys, TABS, TABLE_DATA, MODAL_FIELDS } from '../constants/tabData'

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'

const App = () => {

    // API data
    const [users, setUsers] = useState({})
    const [toys, setToys] = useState({})
    const [categories, setCategories] = useState({})
    const [brands, setBrands] = useState({})

    // Assign getters and setters to let the template iterate over the table definitions from tabData.js
    TABS.customers.data = users;
    TABS.customers.setter = data => { setUsers(data) };

    TABS.categories.data = categories;
    TABS.categories.setter = data => { setCategories(data) };

    TABS.brands.data = brands;
    TABS.brands.setter = data => { setBrands(data) };

    TABS.toys.data = toys;
    TABS.toys.setter = data => { setToys(data) };

    TABLE_DATA[_tabKeys.toys].derived = {
        brand: b => TABS[_tabKeys.brands].data[b] && TABS[_tabKeys.brands].data[b].title,
        category: c => TABS[_tabKeys.categories].data[c] && TABS[_tabKeys.categories].data[c].title,
        description: d => `${d.slice(0, 100)}${d.length > 100?'...':''}`,
        skills: s => `${s.slice(0, 100)}${s.length > 100?'...':''}`,
    }

    TABLE_DATA[_tabKeys.customers].derived = {
        profile_pic: p => p ? <a href={p} target="_blank"><img src={p} width="80" style={{borderRadius: '4px'}} /></a>:"No picture",
    }

    // Modal states
    const [isModalOpen, setModalOpen] = useState(false)
    const [modalKey, setModalKey] = useState(null) // Key for type of data being processed by the modal (customer, toy, brand, etc)
    const [modalFields, setModalFields] = useState(null) // Data being entered in the modal ( email, address, etc.)
    const [modalObjectKey, setModalObjectKey] = useState(null) // Key of the object, eg: email ID, brand ID. If present, edit mode, else add mode :)

    // App notifs
    const [appErr, setAppErr] = useState([])
    const [appMsg, setAppMsg] = useState([])

    const openModal = () => { setModalOpen(true) }
    const closeModal = () => { setModalOpen(false); setModalFields({}); setModalKey(null); setModalObjectKey(null) }

    const handleModalFieldsChange = ({ target }) => {
        setModalFields({ ...modalFields, [target.name]: target.value })
    }

    const handleModalSubmit = () => {
        (modalObjectKey ? axios.patch : axios.post)(`${API_ROOT}${TABS[modalKey].key}/${modalObjectKey ? `${modalObjectKey}/` : ''}`, modalFields)
            .then(resp => {
                TABS[modalKey].setter({ ...TABS[modalKey].data, [resp.data[TABS[modalKey].uid]]: resp.data })
                pushAppMsg(`[${TABS[modalKey].singular}] ${resp.data[TABS[modalKey].verbose]} ${modalObjectKey ? 'updated' : 'added'} succesfully!`)
                closeModal()
            }).catch(err => { console.log(err); pushAppErr(JSON.stringify(err)) })
    }

    const pushAppMsg = e => { setAppMsg([...appMsg, e]) }
    const handleMsgAlertClose = i => e => { setAppMsg([...appMsg].filter(k => k != i)) }

    const pushAppErr = e => { setAppErr([...appErr, e]) }
    const handleErrAlertClose = i => e => { setAppErr([...appErr].filter(k => k != i)) }

    // Fetch data when the app loads
    const fetchData = () => {
        Object.values(TABS).map(tab =>
            axios.get(`${API_ROOT}${tab.key}/`)
                .then(resp => { tab.setter(zipObject(resp.data.map(e => e[tab.uid]), resp.data)) })
                .catch(err => { console.log(err); pushAppErr(JSON.stringify(err)) })
        )
    }

    const deleteMethods = zipObject(
        Object.values(TABS).map(e => e.key),

        Object.values(TABS).map(tab =>
            (id) => axios.delete(`${API_ROOT}${tab.key}/${id}/`)
                .then(resp => {
                    let newState = { ...tab.data }
                    let verbose = newState[id][tab.verbose]
                    delete newState[id]

                    tab.setter(newState)

                    pushAppMsg(`[${tab.singular}] ${verbose} deleted succesfully!`)
                })
                .catch(err => { console.log(err); pushAppErr(JSON.stringify(err)) })
        )
    )

    const createEntry = dataType => e => {
        setModalKey(dataType)
        openModal()
    }

    const editEntry = (dataType, id) => e => {
        setModalObjectKey(id)
        setModalKey(dataType)
        openModal()
    }

    useEffect(() => {
        modalKey && setModalFields(zipObject(MODAL_FIELDS[modalKey].map(e => e.key), MODAL_FIELDS[modalKey].map(e => '')))
    }, [modalKey])

    useEffect(() => {
        modalKey && modalObjectKey && setModalFields(zipObject(MODAL_FIELDS[modalKey].map(e => e.key), MODAL_FIELDS[modalKey].map(e => TABS[modalKey].data[modalObjectKey][e.key])))
    }, [modalObjectKey])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="">
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">PlayHopp Admin</Navbar.Brand>
                {/* <Nav.Link href="#opt">Option</Nav.Link> */}
            </Navbar>
            <br />
            <Container fluid className="contentContainer">
                <br />
                <Tabs>

                    {Object.values(TABS).map(tabData => (
                        <Tab key={tabData.key} eventKey={tabData.key} title={tabData.title}>
                            <br />
                            {(!tabData.data || (Object.keys(tabData.data).length == 0)) ? <div className="loadingSpinnerContainer"><Spinner animation="border" variant="info" /> </div> :
                                <>
                                    <Button variant="success" style={{ float: 'right' }} onClick={createEntry(tabData.key)}>Add {tabData.singular}</Button>
                                    <h3>{tabData.title}</h3>
                                    <br />
                                    <br />
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>S. No</th>
                                                {Object.values(TABLE_DATA[tabData.key].fields).map(f => (<th key={f}>{f}</th>))}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(tabData.data).map((dataSource, i) => (
                                                <tr key={dataSource[tabData.uid]}>
                                                    <td>{i + 1}</td>

                                                    {/* {Object.keys(TABLE_DATA[tabData.key].fields).map(f => (<td key={f}>{dataSource[f]}</td>))} */}
                                                    {Object.keys(TABLE_DATA[tabData.key].fields).map(f =>
                                                        (<td key={f}>
                                                            {('derived' in TABLE_DATA[tabData.key]) && (f in TABLE_DATA[tabData.key].derived)
                                                                ? TABLE_DATA[tabData.key].derived[f](dataSource[f])
                                                                // ? TABLE_DATA[tabData.key].derived[f](dataSource[f])
                                                                : dataSource[f]}
                                                        </td>)
                                                    )}
                                                    <td>
                                                        <ButtonGroup>
                                                            <Button variant="outline-primary" onClick={editEntry(tabData.key, dataSource[tabData.uid])}>Edit</Button>
                                                            <Button variant="outline-danger" onClick={() => deleteMethods[tabData.key](dataSource[tabData.uid])}>Delete</Button>
                                                        </ButtonGroup>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <br />
                                    <hr />
                                    <br />
                                </>
                            }
                        </Tab>
                    ))}
                </Tabs>
                <br />
                {appErr.map((e, i) => <Alert key={`${e}-${i}`} variant="danger" dismissible onClose={handleErrAlertClose(e)}>{e}</Alert>)}
                {appMsg.map((e, i) => <Alert key={`${e}-${i}`} variant="success" dismissible onClose={handleMsgAlertClose(e)}>{e}</Alert>)}

                <br />

            </Container>
            {modalKey && modalFields &&
                <Modal show={isModalOpen} onHide={closeModal} size="md">
                    <Modal.Header closeButton><Modal.Title>Add {TABS[modalKey].singular} </Modal.Title></Modal.Header>
                    <Modal.Body>
                        {MODAL_FIELDS[modalKey].map(fields => (
                            <Form key={fields.key} style={{ padding: '10px 30px', margin: 'auto' }} onSubmit={e => { e.preventDefault(); handleModalSubmit() }}>
                                <Form.Group>
                                    <Form.Label>{fields.label}</Form.Label>
                                    <Form.Control name={fields.key} type={fields.type || 'text'} placeholder={`Enter ${fields.label}`}
                                        {...fields.props} onChange={handleModalFieldsChange} value={modalFields[fields.key] || ''}>
                                        {fields.options && Object.keys(TABS[fields.options].data).map(f => <option value={f}>{TABS[fields.options].data[f].title}</option>)}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup>
                            <Button variant="success" onClick={handleModalSubmit}>Save</Button>
                            <Button variant="outline-warning" onClick={closeModal}>Cancel</Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Modal>
            }
        </div>
    )
}

export default App