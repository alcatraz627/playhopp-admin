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
    brands: 'brands',
    toys: 'toys',
}

let TABS = {
    [_tabKeys.customers]: {
        // ..._tabTemplate,
        data: undefined,
        setter: undefined,
        key: _tabKeys.customers,
        title: 'Customers',
        singular: 'Customer',
        verbose: 'username',

        uid: 'username',
    },
    [_tabKeys.categories]: {
        // ..._tabTemplate,
        data: undefined,
        setter: undefined,
        key: _tabKeys.categories,
        title: 'Categories',
        singular: 'Category',
        verbose: 'title',

        uid: 'id',
    },
    [_tabKeys.brands]: {
        // ..._tabTemplate,
        data: undefined,
        setter: undefined,
        key: _tabKeys.brands,
        title: 'Brands',
        singular: 'Brand',
        verbose: 'title',

        uid: 'id',
    },
    [_tabKeys.toys]: {
        // ..._tabTemplate,
        data: undefined,
        setter: undefined,
        key: _tabKeys.toys,
        title: 'Toys',
        singular: 'Toy',
        verbose: 'title',

        uid: 'id',
    },
};

console.log(TABS);

let TABLE_DATA = {
    [_tabKeys.customers]: {
        fields: {
            username: "Email ID",
            first_name: "Name",
            address: "Address",
            contact_number: "Contact Number",
        },
    },
    [_tabKeys.categories]: {
        fields: {
            title: "Title",
        },
    },
    [_tabKeys.brands]: {
        fields: {
            title: "Title",
            id: "ID",
        },
    },
    [_tabKeys.toys]: {
        fields: {
            title: "Title",
            description: "Description",
            skills: "Skills",
            platIdeas: "Play Ideas",
            minAge: 'Min Age',
            maxAge: 'Max Age',
            piecesNumber: 'Number of Pieces',
            brand: 'Brand',
            category: 'Category',
        },
    },
}

const MODAL_FIELDS = {
    [_tabKeys.brands]: [
        {
            key: 'title',
            type: 'text',
            label: 'Brand Title',
            validator: e => e.length > 1
        }
    ],
    [_tabKeys.categories]: [
        {
            key: 'title',
            type: 'text',
            label: 'Category Title',
            validator: e => e.length > 1
        }
    ],

    [_tabKeys.toys]: [
        {
            key: 'title',
            type: 'text',
            label: 'Toy Title',
            validator: e => e.length > 1,
        },
        {
            key: 'description',
            type: 'text',
            label: 'Description',
            props: {
                as: 'textarea',
                rows: 3,
            },
            validator: e => e.length > 1,
        },
        {
            key: 'skills',
            type: 'text',
            label: 'Skills',
            props: {
                as: 'textarea',
                rows: 3,
            },
            validator: e => e.length > 1,
        },
        {
            key: 'playIdeas',
            type: 'text',
            label: 'Play Ideas',
            props: {
                as: 'textarea',
                rows: 3,
            },
            validator: e => e.length > 1,
        },
        {
            key: 'minAge',
            type: 'number',
            label: 'Min Age',
        },
        {
            key: 'maxAge',
            type: 'number',
            label: 'Max Age',
        },
        {
            key: 'piecesNumber',
            type: 'number',
            label: 'Number of Pieces',
        },
        {
            key: 'brand',
            label: 'Brand',
            props: {
                as: 'select',
            },
            options: _tabKeys.brands,
        },
        {
            key: 'category',
            label: 'Category',
            props: {
                as: 'select',
                // multiple: true,
            },
            options: _tabKeys.categories,
        },
    ],

    [_tabKeys.customers]: [
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

const API_ROOT = `http://35.154.205.76/api/`
// const API_ROOT = '/api/'
// const API_ROOT = '//localhost:8000/api/'

const App = () => {

    const [isModalOpen, setModalOpen] = useState(false)
    const [modalKey, setModalKey] = useState(null) // Key for type of data being processed by the modal (customer, toy, brand, etc)
    const [modalFields, setModalFields] = useState(null) // Data being entered in the modal ( email, address, etc.)

    const [modalObjectKey, setModalObjectKey] = useState(null) // Key of the object, eg: email ID, brand ID. If present, edit mode, else add mode :)

    const [appErr, setAppErr] = useState([])
    const [appMsg, setAppMsg] = useState([])

    const [users, setUsers] = useState({})
    const [toys, setToys] = useState({})
    const [categories, setCategories] = useState({})
    const [brands, setBrands] = useState({})



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
    }

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
                .then(resp => { tab.setter(_.zipObject(resp.data.map(e => e[tab.uid]), resp.data)) })
                .catch(err => { console.log(err); pushAppErr(JSON.stringify(err)) })
        )
    }

    const deleteMethods = _.zipObject(
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
        // console.log(id)
        openModal()
    }

    useEffect(() => {
        modalKey && setModalFields(_.zipObject(MODAL_FIELDS[modalKey].map(e => e.key), MODAL_FIELDS[modalKey].map(e => '')))
        // return () => { setModalFields({}) }
    }, [modalKey])

    useEffect(() => {
        modalKey && modalObjectKey && setModalFields(_.zipObject(MODAL_FIELDS[modalKey].map(e => e.key), MODAL_FIELDS[modalKey].map(e => TABS[modalKey].data[modalObjectKey][e.key])))
        // return () => { setModalFields({}) }
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
            <Container>
                <br />
                <Tabs>

                    {Object.values(TABS).map(tabData => (
                        <Tab key={tabData.key} eventKey={tabData.key} title={tabData.title}>
                            {/* <pre>
                                {JSON.stringify(modalFields, null, 2)}
                            </pre> */}
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
                                                                ? `${(TABLE_DATA[tabData.key].derived[f](dataSource[f]))}`
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