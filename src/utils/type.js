const knownTypes = {

    oss: [
        'Ghost',
        'express-hbs',
        'Ghost-CLI',
        'action-deploy-theme',
        'knex-migrator',
        'SDK',
        'gscan',
        'Koenig',
        'framework',
        'Zapier',
        'Portal',
        'comments-ui',
        'sodo-search',
        'Themes'
    ],

    theme: [
        'Casper',
        'Themes',
        'Alto',
        'Bulletin',
        'Dawn',
        'Digest',
        'Dope',
        'Ease',
        'Edge',
        'Edition',
        'Headline',
        'Journal',
        'London',
        'Ruby',
        'Wave',
        'Argon',
        'Tribeca',
        'Starter',
        'Lyra',
        'Massively',
        'Pico',
        'Editorial',
        'Roon',
        'Zap'
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
