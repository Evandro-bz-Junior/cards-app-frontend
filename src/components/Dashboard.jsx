import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaSave } from "react-icons/fa";
import { MdDeleteForever, MdCancel } from "react-icons/md";


import "./Dashboard.css"

export default function Dashboard() {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [formData, setFormData] = useState({ title: "", content: "", color: "blue" });
    const [filterColor, setFilterColor] = useState("all");
    const [message, setMessage] = useState("");
    const [editingCardId, setEditingCardId] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: "", content: "", color: "blue" });

    const token = localStorage.getItem("token");

    const hexToName = {
        "#0000FF": "blue",
        "#008000": "green",
        "#FF0000": "red",
        "#FFFF00": "yellow",
    };

    const nameToHex = {
        blue: "#0000FF",
        green: "#008000",
        red: "#FF0000",
        yellow: "#FFFF00",
    };

    useEffect(() => {
        async function fetchCards() {
            try {
                const res = await axios.get("http://localhost:3000/api/cards", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const cardsWithColorName = (res.data.cards || []).map((card) => ({
                    ...card,
                    colorName: hexToName[card.color] || "gray",
                }));

                setCards(cardsWithColorName);
                setFilteredCards(cardsWithColorName);
            } catch (error) {
                console.error("Erro ao buscar cards:", error);
            }
        }

        fetchCards();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.title.length > 20) {
            setMessage("O título deve ter no máximo 20 caracteres.");
            return;
        }

        try {
            const payload = {
                ...formData,
                color: nameToHex[formData.color] || "#0000FF",
            };


            const res = await axios.post("http://localhost:3000/api/cards", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newCard = {
                ...res.data.card,
                colorName: formData.color,
            };

            setCards([...cards, newCard]);
            setFilteredCards([...cards, newCard]);
            setFormData({ title: "", content: "", color: "blue" });
            setMessage("Card criado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar card:", error);
            setMessage("Erro ao criar card.");
        }
    };

    const handleFilter = (color) => {
        setFilterColor(color);
        if (color === "all") {
            setFilteredCards(cards);
        } else {
            setFilteredCards(cards.filter((card) => card.colorName === color));
        }
    };

    const startEditing = (card) => {
        setEditingCardId(card.id);
        setEditFormData({
            title: card.title,
            content: card.content,
            color: card.colorName,
        });
    };

    const cancelEditing = () => {
        setEditingCardId(null);
    };

    const saveEdit = async (cardId) => {
        if (formData.title.length > 20) {
            setMessage("O título deve ter no máximo 20 caracteres.");
            return;
        }
        try {
            const payload = {
                title: editFormData.title,
                content: editFormData.content,
                color: nameToHex[editFormData.color] || "#0000FF",
            };

            const res = await axios.put(`http://localhost:3000/api/cards/${cardId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedCard = {
                ...res.data.card,
                colorName: hexToName[res.data.card.color] || "gray",
            };

            const updatedCards = cards.map((card) =>
                card.id === cardId ? updatedCard : card
            );

            setCards(updatedCards);
            setFilteredCards(
                filterColor === "all"
                    ? updatedCards
                    : updatedCards.filter((card) => card.colorName === filterColor)
            );

            setEditingCardId(null);
            setMessage("Card atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar card:", error);
            setMessage("Erro ao atualizar card.");
        }
    };

    const deleteCard = async (cardId) => {
        if (!window.confirm("Tem certeza que quer deletar este card?")) return;

        try {
            await axios.delete(`http://localhost:3000/api/cards/${cardId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedCards = cards.filter((card) => card.id !== cardId);
            setCards(updatedCards);
            setFilteredCards(
                filterColor === "all"
                    ? updatedCards
                    : updatedCards.filter((card) => card.colorName === filterColor)
            );

            setMessage("Card deletado com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar card:", error);
            setMessage("Erro ao deletar card.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <>
            <div className="w-full flex justify-end px-8 mt-4">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                >
                    Sair
                </button>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 ">

                <div className="w-full lg:max-w-xs p-6 bg-gray-200 rounded shadow h-fit newcard">
                    <h2 className="text-3xl font-bold mb-6 text-center">Novo Card</h2>
                    {message && <p className="text-center text-sm mb-4 text-green-600">{message}</p>}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input type="text" maxLength={20} placeholder="Título" required className="w-full p-2 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        <textarea placeholder="Conteúdo" required className="w-full p-2 border rounded resize-none" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                        <div>
                            <label className="block mb-1">Prioridade:</label>
                            <select className="w-full p-2 border rounded" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })}>
                                <option value="blue">Azul</option>
                                <option value="green">Verde</option>
                                <option value="red">Vermelho</option>
                                <option value="yellow">Amarelo</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-fit block mx-auto cursor-pointer">Criar Card</button>
                    </form>

                    <span className="block mt-6 mb-2 text-center">Filtro por cor:</span>
                    <div className="flex flex-wrap gap-2  justify-center">
                        <button
                            onClick={() => handleFilter("all")}
                            className="px-3 py-1 bg-gray-300 rounded h-fit cursor-pointer"
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => handleFilter("blue")}
                            className="px-3 py-1 bg-blue-300 rounded h-fit cursor-pointer"
                        >
                            Azul
                        </button>
                        <button
                            onClick={() => handleFilter("green")}
                            className="px-3 py-1 bg-green-300 rounded h-fit cursor-pointer"
                        >
                            Verde
                        </button>
                        <button
                            onClick={() => handleFilter("red")}
                            className="px-3 py-1 bg-red-300 rounded h-fit cursor-pointer"
                        >
                            Vermelho
                        </button>
                        <button
                            onClick={() => handleFilter("yellow")}
                            className="px-3 py-1 bg-yellow-300 rounded h-fit cursor-pointer"
                        >
                            Amarelo
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCards.map((card) => (
                            <div key={card.id} className={`cards p-4 rounded-none shadow min-h-[250px] flex flex-col justify-between text-white ${card.colorName === "blue" ? "bg-blue-500" :
                                card.colorName === "green" ? "bg-green-500" :
                                    card.colorName === "red" ? "bg-red-500" :
                                        card.colorName === "yellow" ? "bg-yellow-500 text-black" :
                                            "bg-gray-300 text-black"
                                }`}>
                                {editingCardId === card.id ? (
                                    <>
                                        <input className="w-full p-1 border rounded mb-2 text-black" maxLength={20} value={editFormData.title} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} />
                                        <textarea className="w-full p-1 border rounded mb-2 overflow-y-auto overflow-x-hidden text-black resize-none" value={editFormData.content} onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })} />
                                        <span className="text-black">Cor:</span>
                                        <select className="w-full p-1 border rounded mb-2 text-black" value={editFormData.color} onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}>
                                            <option value="blue">Azul</option>
                                            <option value="green">Verde</option>
                                            <option value="red">Vermelho</option>
                                            <option value="yellow">Amarelo</option>
                                        </select>
                                        <div className="flex gap-2 justify-center">
                                            <button className="bg-green-600 text-black px-6 py-1 border-2  rounded " onClick={() => saveEdit(card.id)}><FaSave />
                                            </button>
                                            <button className="bg-gray-500 text-black px-6 py-1 border-2  rounded " onClick={cancelEditing}><MdCancel /></button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg text-black font-bold capitalize text-center ">{card.title}</h3>
                                        <div className="text-sm w-full min-h-[78px] max-h-24 overflow-y-auto overflow-x-hidden break-words p-2 /*   */ rounded border-1 border-black-100 mb-2  text-black">
                                            {card.content}
                                        </div>
                                        <div className="flex gap-2 mt-3 justify-center">
                                            <button onClick={() => startEditing(card)} className="bg-yellow-400 text-black px-6 py-1 border-2  rounded hover:bg-yellow-500 "><FaEdit /></button>
                                            <button onClick={() => deleteCard(card.id)} className="bg-red-600 text-black px-6 py-1 border-2  rounded hover:bg-red-700 "><MdDeleteForever /></button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
