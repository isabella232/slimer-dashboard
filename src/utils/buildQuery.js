const buildQuery = (params, type, base = '') => {
    const repoFilter = params.getAll('repo');
    const authorFilter = params.getAll('author');
    const labelFilter = params.getAll('label');

    let repoQuery;

    if (repoFilter.length > 0) {
        repoQuery = repoFilter.map((name) => {
            return `repo:TryGhost/${name}`;
        }).join(' ');
    } else {
        repoQuery = 'org:TryGhost';
    }

    let query = `${repoQuery} is:${type} state:open sort:updated ${base}`;

    if (authorFilter.length > 0) {
        const authorQuery = authorFilter.map((name) => {
            return `author:${name}`;
        }).join(' ');

        query = `${query} ${authorQuery}`;
    }

    if (labelFilter.length > 0) {
        const labelQuery = labelFilter.map((name) => {
            return `label:"${name}"`;
        }).join(' ');

        query = `${query} ${labelQuery}`;
    }

    return query;
};

export default buildQuery;
