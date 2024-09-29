import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTickets } from "../redux/actions";
import { ReactComponent as UrgentIcon } from "../icons_FEtask/SVG - Urgent Priority colour.svg";
import { ReactComponent as HighIcon } from "../icons_FEtask/Img - High Priority.svg";
import { ReactComponent as LowIcon } from "../icons_FEtask/Img - Low Priority.svg";
import { ReactComponent as MediumIcon } from "../icons_FEtask/Img - Medium Priority.svg";
import { ReactComponent as NoPriorityIcon } from "../icons_FEtask/No-priority.svg";
import { ReactComponent as Backlog } from "../icons_FEtask/Backlog.svg";
import { ReactComponent as Todo } from "../icons_FEtask/To-do.svg";
import { ReactComponent as InProgress } from "../icons_FEtask/in-progress.svg";
import { ReactComponent as Cancel } from "../icons_FEtask/Cancelled.svg";
import { ReactComponent as Done } from "../icons_FEtask/Done.svg";
import { ReactComponent as Display } from "../icons_FEtask/Display.svg";
import { ReactComponent as Dots } from "../icons_FEtask/3 dot menu.svg";
import { ReactComponent as Add } from "../icons_FEtask/add.svg";
import { ReactComponent as FeatureIcon } from "../icons_FEtask/SVG - Urgent Priority grey.svg";
import { ReactComponent as Down } from "../icons_FEtask/down.svg";

const Home = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error, users } = useSelector((state) => state);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [displayDropdown, setDisplayDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const priorityLabels = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
    0: "No priority",
  };

  const userIcons = {
    "usr-1": "https://avatar.iran.liara.run/public/16",
    "usr-2": "https://avatar.iran.liara.run/public/26",
    "usr-3": "https://avatar.iran.liara.run/public/38",
    "usr-4": "https://avatar.iran.liara.run/public/50",
    "usr-5": "https://avatar.iran.liara.run/public/22",
  };

  const priorityIcons = {
    Urgent: <UrgentIcon />,
    High: <HighIcon />,
    Medium: <MediumIcon />,
    Low: <LowIcon />,
    "No priority": <NoPriorityIcon />,
  };

  const statusIcons = {
    Backlog: <Backlog />,
    Todo: <Todo />,
    "In progress": <InProgress />,
    Canceled: <Cancel />,
    Done: <Done />,
  };

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching tickets:", error);
    }
  }, [error]);

  // Sorting function
  const sortTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      if (sortBy === "priority") {
        return b.priority - a.priority; // Descending order for priority
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title); // Ascending order for title
      }
      return 0;
    });
  };

  const toggleDisplayDropdown = () => {
    setDisplayDropdown(!displayDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDisplayDropdown(false); // Close dropdown
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const groupTickets = () => {
    if (!tickets || tickets.length === 0) return {};

    const sortedTickets = sortTickets(tickets);

    if (groupBy === "status") {
      return sortedTickets.reduce((acc, ticket) => {
        acc[ticket.status] = acc[ticket.status] || [];
        acc[ticket.status].push(ticket);
        return acc;
      }, {});
    }

    if (groupBy === "user") {
      return sortedTickets.reduce((acc, ticket) => {
        const user =
          users.find((user) => user.id === ticket.userId)?.name || "Unassigned";
        acc[user] = acc[user] || [];
        acc[user].push(ticket);
        return acc;
      }, {});
    }

    if (groupBy === "priority") {
      return sortedTickets.reduce((acc, ticket) => {
        const priorityLabel = priorityLabels[ticket?.priority];
        if (priorityLabel) {
          acc[priorityLabel] = acc[priorityLabel] || [];
          acc[priorityLabel].push(ticket);
        }
        return acc;
      }, {});
    }

    return {};
  };

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error loading tickets: {error}</p>;

  const groupedTickets = groupTickets();

  const handleGroupChange = (e) => {
    const newGroupBy = e.target.value;
    if (newGroupBy === groupBy) {
      setDisplayDropdown(false);
    } else {
      setGroupBy(newGroupBy);
      setDisplayDropdown(false);
    }
  };

  const handleOrderChange = (e) => {
    const newSortBy = e.target.value;
    if (newSortBy === sortBy) {
      setDisplayDropdown(false);
    } else {
      setSortBy(newSortBy);
      setDisplayDropdown(false);
    }
  };

  return (
    <div className="after-root">
      <div className="dropdowns">
        <button className="button-dropdown" onClick={toggleDisplayDropdown}>
          <Display style={{ marginRight: "3px" }} /> Display <Down></Down>
        </button>

        {displayDropdown && (
          <div className="dropdown-menu">
            <div className="DropListings">
              <label style={{ marginRight: "10px" }}>Grouping</label>
              <select
                value={groupBy}
                onChange={handleGroupChange}
                className="form-select"
                style={{ width: "100px" }}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="DropListings">
              <label style={{ marginRight: "10px" }}>Ordering</label>
              <select
                value={sortBy}
                onChange={handleOrderChange}
                className="form-select"
                style={{ width: "100px" }}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div className="kanban-board">
        {Object.keys(groupedTickets).map((group) => {
          const user =
            groupBy === "user" ? users.find((u) => u.name === group) : null;

          return (
            <div key={group} className="kanban-column">
              <div className="group-title">
                <div
                  className="button-outer"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {groupBy === "priority" && priorityIcons[group]}
                  {groupBy === "status" && statusIcons[group]}
                  {groupBy === "user" && user && (
                    <div
                      className="user-info"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        src={userIcons[user.id]}
                        alt={user.name}
                        style={{
                          width: "1.4em",
                          height: "1.4em",
                          marginRight: "8px",
                        }}
                      />
                      <h2 style={{ margin: 0 }}>{group}</h2>
                    </div>
                  )}
                  <div className="name-number">
                    {groupBy !== "user" && (
                      <h2
                        style={{
                          marginRight: "8px",
                          marginLeft: "5px",
                          fontWeight: "0.3em",
                        }}
                      >
                        {group}
                      </h2>
                    )}
                    <h5 style={{ marginLeft: "15px" }}>
                      {groupedTickets[group].length}
                    </h5>
                  </div>
                </div>
                <div style={{ display: "flex", marginLeft: "3px" }}>
                  <Add />
                  <Dots />
                </div>
              </div>

              {groupedTickets[group].map((ticket) => (
                <div key={ticket.id} className="kanban-card">
                  <div className="ticket-id-box">
                    <div>
                      <h5>{ticket.id}</h5>
                    </div>
                    {groupBy === "priority" && (
                      <div style={{ width: "20px" }}>
                        <img
                          src={userIcons[ticket.userId]}
                          alt="User Avatar"
                          style={{ width: "1.4em", height: "1.4em" }}
                        />
                      </div>
                    )}
                    {groupBy === "status" && (
                      <div style={{ width: "20px" }}>
                        <img
                          src={userIcons[ticket.userId]}
                          alt="User Avatar"
                          style={{ width: "1.4em", height: "1.4em" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="user-title-box">
                    {statusIcons[ticket.status]}
                    <div className="title-div">
                      <h5>{ticket.title}</h5>
                    </div>
                  </div>
                  <div className="feature-icon">
                    <div>{priorityIcons[priorityLabels[ticket.priority]]}</div>

                    <div className="tag-with-icon">
                      <div className="dot"></div>
                      <p>{ticket.tag}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
