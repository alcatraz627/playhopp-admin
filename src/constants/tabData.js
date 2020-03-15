
const _tabTemplate = {
    data: undefined,
    setter: undefined,
}

export const _tabKeys = {
    customers: 'customers',
    categories: 'categories',
    brands: 'brands',
    toys: 'toys',
}

export const TABS = {
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

export const TABLE_DATA = {
    [_tabKeys.customers]: {
        fields: {
            profile_pic: "Profile Pic",
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

export const MODAL_FIELDS = {
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
        {
            key: 'profile_pic',
            type: 'text',
            label: 'Profile Pic'
        }
    ],
}
