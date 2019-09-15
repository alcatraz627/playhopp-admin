import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import axios from 'axios'

import { Container, Grid, Nav, Navbar, Table, Button, ButtonToolbar, Tabs, Tab, Alert, Modal, ButtonGroup, Form, Spinner, } from 'react-bootstrap'

const _tabTemplate = {
    data: undefined,
    setter: undefined,
}

let _tabKeys = {
    customers: 'customers',
    categories: 'categories',
    brands: 'brands'
}

let TABS = {
    [_tabKeys.customers]: {
        // ..._tabTemplate,
        data: undefined,
        setter: undefined,
        key: [_tabKeys.customers],
        title: 'Customers',
        singular: 'Customer',
        verbose: 'username',

        uid: 'username',
    },
    [_tabKeys.categories]: {
        // ..._tabTemplate,
        data: undefined,
        setter: undefined,
        key: [_tabKeys.categories],
        title: 'Categories',
        singular: 'Category',
        verbose: 'title',

        uid: 'id',
    },
    [_tabKeys.brands]: {
        // ..._tabTemplate,
        data: undefined,
        setter: undefined,
        key: [_tabKeys.brands],
        title: 'Brands',
        singular: 'Brand',
        verbose: 'title',

        uid: 'id',
    },
    // toys: 'Toys',
    // brands: 'Brands',
}

const TABLE_DATA = {
    [TABS.customers.key]: {
        fields: {
            username: "Email ID",
            first_name: "Name",
            address: "Address",
            contact_number: "Contact Number",
        },
        // actions:
    },
    [TABS.categories.key]: {
        fields: {
            title: "Title",
        },
        // actions:
    },
    [TABS.brands.key]: {
        fields: {
            title: "Title",
        },
        // actions:
    },
}

const MODAL_FIELDS = {
    [TABS.brands.key]: [
        {
            key: 'title',
            type: 'text',
            label: 'Brand Title',
            validator: e => e.length > 1
        }
    ],
    [TABS.categories.key]: [
        {
            key: 'title',
            type: 'text',
            label: 'Category Title',
            validator: e => e.length > 1
        }
    ],
    [TABS.customers.key]: [
        {
            key: 'username',
            type: 'text',
            label: 'Customer Email',
            // validator: e => e.length > 5,
        },
        {
            key: 'first_name',
            type: 'text',
            label: 'Name',
            // validator: e => e.length > 5,
        },
        {
            key: 'password',
            type: 'password',
            label: 'Password',
            // validator: e => e.length > 5,
        },
        {
            key: 'address',
            type: 'text',
            label: 'Customer Address',
            // validator: e => e.length > 5,
            props: {
                as: 'textarea',
                rows: 3,
            }
        },
        {
            key: 'contact_number',
            type: 'text',
            label: 'Contact Number',
            // validator: e => e.length > 5,
        },
    ],
}

const API_ROOT = '//localhost:8000/api/'

const App = () => {

    const [isModalOpen, setModalOpen] = useState(false)
    const [modalKey, setModalKey] = useState(null) // Key for type of data being processed by the modal
    const [modalFields, setModalFields] = useState(null) // Data being entered in the modal

    const [appErr, setAppErr] = useState([])
    const [appMsg, setAppMsg] = useState([])

    const [users, setUsers] = useState({})
    const [toys, setToys] = useState({})
    const [categories, setCategories] = useState({})
    const [brands, setBrands] = useState({})


    TABS.customers.data = users;
    TABS.customers.setter = data => { setUsers(data); console.log('User Data changing') };

    TABS.categories.data = categories;
    TABS.categories.setter = data => { setCategories(data); console.log('Category Data changing') };

    TABS.brands.data = brands;
    TABS.brands.setter = data => { setBrands(data); console.log('Brand Data changing') };

    useEffect(() => {
        console.log("Data Changed!")
    }, [users, categories, brands])

    const openModal = () => { setModalOpen(true) }
    const closeModal = () => { setModalOpen(false); setModalFields({}) }

    const handleModalFieldsChange = ({ target }) => {
        setModalFields({ ...modalFields, [target.name]: target.value })
    }

    const handleModalSubmit = () => {
        console.log("Submit:", modalFields);
        // For add only rn
        axios.post(`${API_ROOT}${TABS[modalKey].key}/`, modalFields)
            .then(resp => {

                // console.log({ [resp.data[TABS[modalKey].uid]]: resp.data })
                // console.log({ ...TABS[modalKey].data, [resp.data[TABS[modalKey].uid]]: resp.data })

                TABS[modalKey].setter({ ...TABS[modalKey].data, [resp.data[TABS[modalKey].uid]]: resp.data })

                pushAppMsg(`[${TABS[modalKey].singular}] ${resp.data[TABS[modalKey].verbose]} added succesfully!`)
                closeModal()
            })
            .catch(err => { console.log(err); pushAppErr(JSON.stringify(err)) })

    }

    const pushAppMsg = e => {
        setAppMsg([...appMsg, e])
    }

    const handleMsgAlertClose = i => e => {
        setAppMsg([...appMsg].filter(k => k != i))
    }

    const pushAppErr = e => {
        setAppErr([...appErr, e])
    }

    const handleErrAlertClose = i => e => {
        setAppErr([...appErr].filter(k => k != i))
    }

    const fetchData = () => {
        Object.values(TABS).map(tab =>
            axios.get(`${API_ROOT}${tab.key}/`)
                .then(resp => { console.log(resp); tab.setter(_.zipObject(resp.data.map(e => e[tab.uid]), resp.data)) })
                .then(e => { console.log('Complete') })
                .catch(err => { console.log(err); pushAppErr(JSON.stringify(err)) })
        )
    }

    const deleteMethods = _.zipObject(
        Object.values(TABS).map(e => e.key),

        Object.values(TABS).map(tab =>
            (id) =>
            //  axios.delete(`${API_ROOT}${tab.key}/${id}/`)
            //     .then(resp =>
            {
                let newState = { ...tab.data }
                let verbose = newState[id][tab.verbose]
                delete newState[id]
                console.log(newState)
                tab.setter(newState)

                pushAppMsg(`[${tab.singular}] ${verbose} deleted succesfully!`)
            }
            // )
            // .catch(err => { console.log(err); pushAppErr(JSON.stringify(err)) })
        )
    )

    const createEntry = dataType => e => {
        setModalKey(dataType)
        openModal()
    }

    useEffect(() => {
        modalKey && setModalFields(_.zipObject(MODAL_FIELDS[modalKey].map(e => e.key), MODAL_FIELDS[modalKey].map(e => '')))
        return () => { setModalFields({}) }
    }, [modalKey])

    useEffect(() => {
        fetchData()
        // setBrands({ 2: { id: 2, title: 'eee' } })
    }, [])

    return (
        <div className="">
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">PlayHopp Admin</Navbar.Brand>
                {/* <Nav.Link href="#opt">Option</Nav.Link> */}
            </Navbar>
            <br />
            <Container>
                {appErr.map((e, i) => <Alert key={`${e}-${i}`} variant="danger" dismissible onClose={handleErrAlertClose(e)}>{e}</Alert>)}
                {appMsg.map((e, i) => <Alert key={`${e}-${i}`} variant="success" dismissible onClose={handleMsgAlertClose(e)}>{e}</Alert>)}
                <br />
                <Tabs>
                    {Object.values(TABS).map(tabData => (
                        <Tab key={tabData.key} eventKey={tabData.key} title={tabData.title}>
                            <br />
                            {JSON.stringify(tabData.data)}
                            {Object.keys(tabData.data).length == 0 ? <div className="loadingSpinnerContainer"><Spinner animation="border" variant="info" /> </div> :
                                <>
                                    <Button variant="success" style={{ float: 'right' }} onClick={createEntry(tabData.key)}>Add {tabData.singular}</Button>
                                    <h3>{tabData.title}</h3>
                                    {/* <Button>Add {TABS[tabKey]}</Button> */}
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

                                                    {Object.keys(TABLE_DATA[tabData.key].fields).map(f => (<td key={f}>{dataSource[f]}</td>))}
                                                    <td>
                                                        <ButtonToolbar>
                                                            <Button variant="outline-primary">Edit</Button>
                                                            &nbsp;&nbsp;
                                                    <Button variant="outline-danger" onClick={() => deleteMethods[tabData.key](dataSource[tabData.uid])}>Delete</Button>
                                                        </ButtonToolbar>
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

            </Container>
            {modalKey && modalFields &&
                <Modal show={isModalOpen} onHide={closeModal} size="md">
                    <Modal.Header closeButton><Modal.Title>Add {TABS[modalKey].singular} </Modal.Title></Modal.Header>
                    <Modal.Body>
                        {/* {JSON.stringify(MODAL_FIELDS[modalFields])} */}
                        {MODAL_FIELDS[modalKey].map(fields => (
                            <Form key={fields.key} style={{ padding: '10px 30px', margin: 'auto' }}>
                                <Form.Group>
                                    <Form.Label>{fields.label}</Form.Label>
                                    <Form.Control name={fields.key} type={fields.type || 'text'} placeholder={`Enter ${fields.label}`}
                                        {...fields.props} onChange={handleModalFieldsChange} value={modalFields[fields.key] || ''} />
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