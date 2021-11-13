const Placeholder = () => (
    <ul className="card-list placeholder">
        {Array(20)
            .fill('')
            .map((line, index) => (
                <li key={index} className="card">
                    <div className="title name-placeholder" />
                    <div className="desc text-placeholder" />
                    <div className="left text-placeholder" />
                    <div className="right text-placeholder" />
                </li>
            ))}
    </ul>
);

export default Placeholder;
