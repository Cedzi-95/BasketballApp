import { useEffect, useState } from "react";
import { fetchTransactionByTeam } from "../api/nbaTransactionApi";

const teams = [
  { id: 1, name: "Atlanta Hawks" },
  { id: 2, name: "Boston Celtics" },
  { id: 4, name: "Brooklyn Nets" },
  { id: 5, name: "Charlotte Hornets" },
  { id: 6, name: "Chicago Bulls" },
  { id: 7, name: "Cleveland Cavaliers" },
  { id: 8, name: "Dallas Mavericks" },
  { id: 9, name: "Denver Nuggets" },
  { id: 10, name: "Detroit Pistons" },
  { id: 11, name: "Golden State Warriors" },
  { id: 14, name: "Houston Rockets" },
  { id: 15, name: "Indiana Pacers" },
  { id: 16, name: "LA Clippers" },
  { id: 17, name: "Los Angeles Lakers" },
  { id: 19, name: "Memphis Grizzlies" },
  { id: 20, name: "Miami Heat" },
  { id: 21, name: "Milwaukee Bucks" },
  { id: 22, name: "Minnesota Timberwolves" },
  { id: 23, name: "New Orleans Pelicans" },
  { id: 24, name: "New York Knicks" },
  { id: 25, name: "Oklahoma City Thunder" },
  { id: 26, name: "Orlando Magic" },
  { id: 27, name: "Philadelphia 76ers" },
  { id: 28, name: "Phoenix Suns" },
  { id: 29, name: "Portland Trail Blazers" },
  { id: 30, name: "Sacramento Kings" },
  { id: 31, name: "San Antonio Spurs" },
  { id: 32, name: "Toronto Raptors" },
  { id: 33, name: "Utah Jazz" },
  { id: 34, name: "Washington Wizards" }
];

/**
 * TransactionPage visar spelarövergångar och kontraktsändringar för ett valt nba-lag.
 * användaren kan välja ett lag i en dropdown och se övergångar för åren 2024 och 2025.
 * datan hämtas från ett api och visas sorterat efter datum.
 *
 * @returns {JSX.Element} en sida som visar övergånghistorik per lag och år
 */
const TransactionPage = () => {
    const [selectedTeam, setSelectedTeam] = useState(1);
    const [transactions2025, setTransactions2025] = useState([]);
    const [transactions2024, setTransactions2024] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTransactions = async () => {
            setLoading(true);
            setError(null);

            try {
                const { transactions2025, transactions2024 } = await fetchTransactionByTeam(selectedTeam);
                
                setTransactions2025(transactions2025);
                setTransactions2024(transactions2024);
            } catch (err) {
                setError("Failed to load transactions.");
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };

        getTransactions();
    }, [selectedTeam]);

    return (
        <div style={{backgroundColor:"gray", display:"flex"}}>
 <div style={{ backgroundColor: "lightgray", margin: "50px", width:"80%", paddingTop: "50px"}}>
    <div id="trade" style={{margin:"2rem", backgroundColor:""}}>
    <h1>Transactions History</h1>
            <p>Select a team to view transaction history.</p>

            <label>Team: </label>
            <select value={selectedTeam} onChange={(e) => setSelectedTeam(Number(e.target.value))}>
                {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                        {team.name}
                    </option>
                ))}
            </select>

            {loading && <p>Loading transactions...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>2025</h3>
            {transactions2025.length > 0 ? (
                <>
                    {transactions2025.map((trade, index) => (
                        <div key={index} style={{width:"", margin: "10px"}}>
                            <strong style={{margin:"2rem", color:"green"}}>{new Date(trade.date).toDateString()}</strong>: {trade.description}
                        </div>
                    ))}
                </>
            ) : (
                !loading && <p>No trades found for this team in 2025.</p>
            )}

        
            <h3>2024</h3>
            {transactions2024.length > 0 ? (
                <div>
                    {transactions2024.map((trade, index) => (
                        <div key={index} style={{width:"", margin: "10px"}}>
                            <strong style={{margin:"2rem", color:"green"}}>{new Date(trade.date).toDateString()}</strong>: {trade.description}
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p>No trades found for this team in 2024.</p>
            )}
    </div>
           
        </div>

        <div style={{paddingTop: "150px"}}>
            <img src="https://spain.id.nba.com/storage/images/wallpapers/1714130685.jpg" alt="" width="500px" height="auto"/>
        </div>
        </div>
       
    );
};

export default TransactionPage;