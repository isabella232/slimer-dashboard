const knownTypes = {

    oss: [
        'Ghost',
        'Admin',
        'express-hbs',
        'Ghost-CLI',
        'action-deploy-theme',
        'knex-migrator',
        'SDK',
        'gscan',
        'Portal',
        'Koenig',
        'framework'
    ]
};

module.exports = {
    containsKnownType: (types) => {
        const typeNames = Object.keys(knownTypes);
        return types.some(o => typeNames.includes(o));
    },
    matchType: (types, name) => {
        return types.some((o) => {
            return knownTypes[o].includes(name);
        });
    }
};
