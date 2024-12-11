import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/groups/${id}`).then((response) => setGroup(response.data));
  }, [id]);

  if (!group) return <div>Loading...</div>;

  return (
    <div>
      <h1>{group.name}</h1>
      <p>Description: {group.description}</p>
    </div>
  );
};

export default GroupDetails;
