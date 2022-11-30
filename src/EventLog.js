import React, { useEffect, useState, useRef } from "react";
import "./stylesheets/EventLog.css";

function EventLog(props) {
  let [events, setEvents] = useState([]);
  let bottomRef = useRef(null);

  useEffect(() => {
    const handleEvent = (event) => {
      setEvents([...events, eventToDiv(event, events.length)]);
    };
    props.socket.on("event", handleEvent);
    return () => {
      props.socket.off("event", handleEvent);
    };
  }, [props.socket, events]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const eventToDiv = (event, idx) => {
    if (event["eventType"] === "flip") {
      return (
        <div className="event-text" key={idx}>
          <div className="user">{event["agent"]}</div>&nbsp;flipped a tile:{" "}
          {event["tile"].toUpperCase()}
        </div>
      );
    }
  };

  return (
    <div className="event-log">
      <div className="event-log-title">Event Log</div>
      <div className="event-list">
        {events} <div ref={bottomRef}></div>
      </div>
    </div>
  );
}

export default EventLog;
