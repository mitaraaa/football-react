import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Modal, Navbar } from "../components";
import "./styles/field.scss";

import email from "../assets/email.svg";
import instagram from "../assets/instagram.svg";
import phone from "../assets/phone.svg";

const style: { [key: string]: string } = {
    height: "unset",
    display: "block",
    flexDirection: "unset",
    justifyContent: "unset",
    alignItems: "unset",
};

const notFoundStyle: { [key: string]: string } = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
};

interface FieldData {
    id: number;
    owner_id: number;
    surface_type: string;
    name: string;
    about: string;
    location: string;
    image: string;
    price: number;
    width: number;
    length: number;
    end_time: string;
    start_time: string;
}

interface OwnerData {
    id: number;
    username: string;
    name: string;
    contacts: {
        email: string;
        phone_number: string;
        instagram: string;
    };
}

interface TimeRange {
    from: Date;
    to: Date;
    booked?: boolean;
}

const generateDateArray = (initialDate: Date) => {
    // Initialize an array to store the relative dates
    const dateArray = [];

    // Add the past two days (-2, -1)
    for (let i = -2; i <= -1; i++) {
        const pastDate = new Date();
        pastDate.setDate(initialDate.getDate() + i);
        dateArray.push(pastDate);
    }

    // Add today
    dateArray.push(initialDate);

    // Add the next two days (+1, +2)
    for (let i = 1; i <= 2; i++) {
        const futureDate = new Date();
        futureDate.setDate(initialDate.getDate() + i);
        dateArray.push(futureDate);
    }

    return dateArray;
};

const getTimeRanges = (
    startTime: string,
    endTime: string,
    bookedTimes: { from: string; to: string }[]
): TimeRange[] => {
    const parseTime = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(":").map(Number);
        const date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        return date;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    const timeRanges: TimeRange[] = [];

    let time = new Date(start);
    while (time.getTime() < end.getTime()) {
        const temp = new Date(time);
        const nextHour = new Date(temp.setHours(time.getHours() + 1));

        const isBooked = bookedTimes.some((booking) => {
            return (
                parseTime(booking.from).getHours() <= time.getHours() &&
                parseTime(booking.to).getHours() >= nextHour.getHours()
            );
        });

        timeRanges.push({
            from: new Date(time),
            to: nextHour,
            booked: isBooked,
        });

        time = nextHour;
    }

    return timeRanges;
};

const DateButton = ({
    date,
    onClick,
    selected,
}: {
    date: Date;
    selected: boolean;
    onClick: () => void;
}) => {
    return (
        <div
            className={"date" + (selected ? " selected" : "")}
            onClick={onClick}
            tabIndex={0}
        >
            <span className="day">{date.getDate()}</span>
            <span className="month">
                {date.toLocaleString("en", { month: "short" })}
            </span>
        </div>
    );
};

const TimeButton = ({
    range,
    onSelect,
    onDeselect,
    booked,
    selected,
}: {
    range: TimeRange;
    onSelect: () => void;
    onDeselect: () => void;
    booked?: boolean;
    selected?: boolean;
}) => {
    return (
        <button
            className={"time" + (selected ? " selected" : "")}
            onClick={() => {
                if (selected) {
                    onDeselect();
                } else {
                    onSelect();
                }
            }}
            disabled={booked}
        >
            <span className="range">
                {range.from.toLocaleString("en", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                })}{" "}
                -{" "}
                {range.to.toLocaleString("en", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                })}
            </span>
        </button>
    );
};

const Field = () => {
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            (document.getElementById("root")!.style as any)[key] = style[key];
        }
    }

    const { fieldId } = useParams({ from: "/fields/$fieldId" });

    const [name, setName] = useState<string>("");
    const [field, setField] = useState<FieldData>();
    const [owner, setOwner] = useState<OwnerData>();

    const [dates, setDates] = useState<Date[]>(generateDateArray(new Date()));
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [times, setTimes] = useState<TimeRange[]>([]);
    const [selectedTimes, setSelectedTimes] = useState<TimeRange[]>([]);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [opening, setOpening] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>();
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [animate, setAnimate] = useState<boolean>(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
            method: "GET",
            credentials: "include",
            mode: "cors",
        }).then((response) => {
            if (response.status === 200) {
                response
                    .json()
                    .then((data) => {
                        setName(data.name);
                    })
                    .catch(() => {
                        setName("");
                    });
            }
        });

        fetch(`${import.meta.env.VITE_API_URL}/fields/${fieldId}`, {
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setField(data);
                    });
                } else if (response.status === 404) {
                    setField(undefined);
                    setErrorMessage("Field not found.");
                    setErrorVisible(true);
                }
            })
            .catch(() => {
                setField(undefined);
                setErrorVisible(true);
            });

        if (field) {
            fetch(`${import.meta.env.VITE_API_URL}/owners/${field.owner_id}`, {
                method: "GET",
            })
                .then((response) => {
                    if (response.status === 200) {
                        response.json().then((data) => {
                            setOwner(data);
                        });
                    } else if (response.status === 404) {
                        setField(undefined);
                        setErrorMessage("Owner not found.");
                        setErrorVisible(true);
                    }
                })
                .catch(() => {
                    setField(undefined);
                    setErrorVisible(true);
                });
        }
    }, []);

    useEffect(() => {
        if (field) {
            fetchFreeTimes().then(() => {});
        }
    }, [selectedDate, field]);

    const proceed = async () => {
        if (selectedTimes.length === 0) {
            return;
        }

        const tzoffset = new Date().getTimezoneOffset() * 60000;

        const { from, to }: { from: Date; to: Date } = getSelectedRange() as {
            from: Date;
            to: Date;
        };

        // remove timezone offset
        const booking_date = new Date(from.valueOf() - tzoffset);
        booking_date.setDate(selectedDate.getDate());

        const booked_until = new Date(to.valueOf() - tzoffset);
        booked_until.setDate(selectedDate.getDate());

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/bookings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    field_id: field!.id,
                    booking_date: booking_date
                        .toISOString()
                        .replace(/:\d+:\d+.\d+Z$/g, ":00:00.000"),
                    booked_until: booked_until
                        .toISOString()
                        .replace(/:\d+:\d+.\d+Z$/g, ":00:00.000"),
                }),
                credentials: "include",
                mode: "cors",
            }
        );

        if (response.status !== 201) {
            const res = await response.json();
            setErrorMessage(res.detail ?? "Invalid username or password.");
            setErrorVisible(true);
        }
    };

    const getSelectedRange = () => {
        if (selectedTimes.length === 0) {
            return;
        }

        const sorted = selectedTimes.sort(
            (a, b) => a.from.getTime() - b.from.getTime()
        );

        const from = sorted[0].from;
        const to = sorted[sorted.length - 1].to;

        return {
            from,
            to,
        };
    };

    const getTotalPrice = () => {
        if (selectedTimes.length === 0) {
            return "0₸";
        }

        const { from, to }: { from: Date; to: Date } = getSelectedRange() as {
            from: Date;
            to: Date;
        };

        const hours = to.getHours() - from.getHours();

        return (hours * field!.price).toString() + "₸";
    };

    const getSelectedTimeRange = () => {
        if (selectedTimes.length === 0) {
            return "Select time";
        }

        const { from, to }: { from: Date; to: Date } = getSelectedRange() as {
            from: Date;
            to: Date;
        };

        const _from = from.toLocaleString("en", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
        });

        const _to = to.toLocaleString("en", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
        });

        return `${_from} - ${_to}`;
    };

    const onSelectHandle = (target: TimeRange) => {
        setSelectedTimes((prevTimes: TimeRange[]) => {
            const updatedSelectedTimes = [...prevTimes, target];

            if (updatedSelectedTimes.length < 2) {
                return updatedSelectedTimes;
            }

            const sortedTimes = updatedSelectedTimes.sort((a, b) => {
                return a.from.getTime() - b.from.getTime();
            });

            const first = sortedTimes[0];
            const second = sortedTimes[sortedTimes.length - 1];

            const inbetween = times.filter((time) => {
                return (
                    time.from.getHours() >= first.from.getHours() &&
                    time.from.getHours() <= second.from.getHours()
                );
            });

            if (inbetween.some((time) => time.booked)) {
                return prevTimes;
            }

            return inbetween ?? [];
        });
    };

    const onDeselectHandle = (target: TimeRange) => {
        setSelectedTimes((prevTimes) => {
            if (selectedTimes.length < 2) {
                const newTimes = prevTimes.filter((time) => {
                    return (
                        time.from.getHours() !== target.from.getHours() &&
                        time.to.getHours() !== target.to.getHours()
                    );
                });
                return newTimes;
            }

            const sortedTimes = selectedTimes.sort((a, b) => {
                return a.from.getHours() - b.from.getHours();
            });

            const first = sortedTimes[0];
            const second = sortedTimes[sortedTimes.length - 1];

            if (target.from.getHours() === first.from.getHours()) {
                // Select all between clicked and second
                const inbetween = times.filter((time) => {
                    return (
                        time.from.getHours() > target.from.getHours() &&
                        time.from.getHours() <= second.from.getHours()
                    );
                });

                if (inbetween.some((time) => time.booked)) {
                    return prevTimes;
                }

                return inbetween;
            }

            if (target.from.getHours() === second.from.getHours()) {
                // Select all between first and clicked
                const inbetween = times.filter((time) => {
                    return (
                        time.from.getHours() >= first.from.getHours() &&
                        time.from.getHours() < target.from.getHours()
                    );
                });

                if (inbetween.some((time) => time.booked)) {
                    return prevTimes;
                }

                return inbetween;
            }

            if (
                target.from.getHours() < second.from.getHours() &&
                target.from.getHours() >= first.from.getHours()
            ) {
                // Select all between first and clicked
                const inbetween = times.filter((time) => {
                    return (
                        time.from.getHours() >= first.from.getHours() &&
                        time.from.getHours() <= target.from.getHours()
                    );
                });

                if (inbetween.some((time) => time.booked)) {
                    return prevTimes;
                }

                return inbetween;
            }

            if (
                target.from.getTime() > first.from.getTime() &&
                target.from.getTime() <= second.from.getTime()
            ) {
                // Select all between clicked and second
                const inbetween = times.filter((time) => {
                    return (
                        time.from.getTime() >= target.from.getTime() &&
                        time.from.getTime() <= second.from.getTime()
                    );
                });

                if (inbetween.some((time) => time.booked)) {
                    return prevTimes;
                }

                return inbetween;
            }

            return prevTimes;
        });
    };

    const fetchFreeTimes = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/fields/${
                field!.id
            }/bookings/${selectedDate.getFullYear()}-${
                selectedDate.getMonth() + 1
            }-${selectedDate.getDate()}`,
            {
                method: "GET",
            }
        );

        if (response.status === 200) {
            response.json().then((data) => {
                setTimes(
                    getTimeRanges(field!.start_time, field!.end_time, data)
                );
            });
        }

        if (response.status === 404) {
            setErrorMessage("Booking data not found.");
            setErrorVisible(true);
        }
    };

    const shiftDays = (direction: "left" | "right") => {
        setDates((prevDates) => {
            const shiftedDates = prevDates.map((date) => {
                const shiftedDate = new Date(date);
                if (direction === "left") {
                    shiftedDate.setDate(shiftedDate.getDate() - 5);
                } else {
                    shiftedDate.setDate(shiftedDate.getDate() + 5);
                }
                return shiftedDate;
            });
            return shiftedDates;
        });
    };

    const TimePicker = () => {
        if (!modalVisible) return null;

        const [closing, setClosing] = useState<boolean>(false);

        return (
            <div
                className={"overlay" + (opening ? " on-open" : "")}
                onAnimationEnd={(event) => {
                    if (event.animationName !== "fade-in") return;
                    setOpening(false);
                }}
            >
                <div
                    className={"modal" + (closing ? " on-close" : "")}
                    onAnimationEnd={(event) => {
                        if (event.animationName !== "fade-out") {
                            return;
                        }

                        setModalVisible(false);
                        setClosing(false);
                    }}
                >
                    <div className="header">
                        <h3>Choose time</h3>
                        <span
                            className="material-symbols-outlined"
                            onClick={() => setClosing(true)}
                        >
                            close
                        </span>
                    </div>
                    <div className="times">
                        {times.map((range, index) => (
                            <TimeButton
                                key={index}
                                range={range}
                                onSelect={() => {
                                    onSelectHandle(range);
                                }}
                                onDeselect={() => {
                                    onDeselectHandle(range);
                                }}
                                booked={range.booked}
                                selected={selectedTimes.some((time) => {
                                    return (
                                        time.from.getTime() ===
                                            range.from.getTime() &&
                                        time.to.getTime() === range.to.getTime()
                                    );
                                })}
                            />
                        ))}
                    </div>
                    <div className="actions">
                        <button
                            className="clear"
                            onClick={() => setSelectedTimes([])}
                        >
                            Clear
                        </button>
                        <button
                            className="confirm"
                            onClick={() => setClosing(true)}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (!field) {
        for (const key in notFoundStyle) {
            if (notFoundStyle.hasOwnProperty(key)) {
                (document.getElementById("root")!.style as any)[key] =
                    notFoundStyle[key];
            }
        }

        return (
            <>
                <Navbar name={name} style={{ position: "sticky" }} />
                <div className="not-found">
                    <span className="material-symbols-outlined">
                        running_with_errors
                    </span>
                    <h1>Field not found</h1>
                    <Link to="/fields">Browse fields</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar name={name} style={{ position: "sticky" }} />
            <main>
                <header
                    style={{
                        background: `linear-gradient(rgb(0 0 0 / 60%), rgb(0 0 0 / 60%)), url(${field.image}), lightgray 0 0 / 100% 118.519% no-repeat`,
                    }}
                    className="main-field"
                >
                    <section className="left">
                        <h1>{field.name}</h1>
                        <span className="location">
                            <span className="material-symbols-outlined">
                                location_on
                            </span>
                            {field.location}
                        </span>
                    </section>
                    <section className="right">
                        <div className="work-hours">
                            <span className="hours">
                                {field.start_time.slice(0, 5)} -{" "}
                                {field.end_time.slice(0, 5)}
                            </span>
                            work hours
                        </div>
                        <div className="price-right">
                            <span className="price">{field.price}₸</span>
                            per hour
                        </div>
                    </section>
                </header>
                <section className="field-info">
                    <div className="info">
                        <div className="parameters">
                            <div className="parameter">
                                Surface
                                <span>
                                    {field.surface_type
                                        .charAt(0)
                                        .toUpperCase() +
                                        field.surface_type.slice(1)}
                                </span>
                            </div>
                            <div className="parameter">
                                Width
                                <span>{field.width} meters</span>
                            </div>
                            <div className="parameter">
                                Length
                                <span>{field.length} meters</span>
                            </div>
                        </div>
                        {field.about && (
                            <div className="about">
                                <h3>About</h3>
                                <p>{field.about}</p>
                            </div>
                        )}
                        <div className="contacts">
                            <h3>Contacts</h3>
                            {owner?.contacts.email && (
                                <div className="contact">
                                    <img src={email} />
                                    {owner?.contacts.email}
                                </div>
                            )}
                            {owner?.contacts.instagram && (
                                <div className="contact">
                                    <img src={instagram} />
                                    {owner?.contacts.instagram}
                                </div>
                            )}
                            {owner?.contacts.phone_number && (
                                <div className="contact">
                                    <img src={phone} />
                                    {owner?.contacts.phone_number}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="order">
                        <h3>Order</h3>
                        <div className="date-picker">
                            <span className="label">Date</span>
                            <div className="calendar">
                                <span
                                    className="material-symbols-outlined"
                                    onClick={() => shiftDays("left")}
                                    tabIndex={0}
                                >
                                    chevron_left
                                </span>
                                {dates.map((date, index) => (
                                    <DateButton
                                        key={index}
                                        date={date}
                                        onClick={() => {
                                            setSelectedTimes([]);
                                            setSelectedDate(date);
                                        }}
                                        selected={
                                            date.toLocaleString("en", {
                                                month: "short",
                                            }) ==
                                                selectedDate.toLocaleString(
                                                    "en",
                                                    {
                                                        month: "short",
                                                    }
                                                ) &&
                                            date.getDate() ==
                                                selectedDate.getDate()
                                        }
                                    />
                                ))}
                                <span
                                    className="material-symbols-outlined"
                                    onClick={() => shiftDays("right")}
                                    tabIndex={0}
                                >
                                    chevron_right
                                </span>
                            </div>
                        </div>
                        <div className="time-picker">
                            <span className="label">Time</span>
                            <div className="times">
                                <h2>{getSelectedTimeRange()}</h2>
                                <button
                                    className="add-time"
                                    onClick={() => {
                                        setModalVisible(true);
                                        setOpening(true);
                                    }}
                                >
                                    Set time
                                </button>
                            </div>
                        </div>
                        <span className="total">
                            Total
                            <span className="big">{getTotalPrice()}</span>
                        </span>
                        <button
                            onClick={proceed}
                            disabled={selectedTimes.length == 0}
                        >
                            Proceed to payment
                        </button>
                    </div>
                </section>
            </main>
            <TimePicker />
            <Modal
                {...{
                    message: errorMessage,
                    animate,
                    visible: errorVisible,
                    setAnimate,
                    setVisible: setErrorVisible,
                }}
            />
        </>
    );
};

export default Field;
