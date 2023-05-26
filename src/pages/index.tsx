import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Index = () => {
    return (
        <div>
            <h1>Index</h1>
            <Link to="/home">Home</Link>
        </div>
    );
};

export default Index;