import { useState, useMemo, useEffect, useRef } from 'react'
import './App.css';


const CELL_SIZE = 20;
const PANEL_WIDTH = 1000;
const PANEL_HEIGHT = 800;

const Cell = (props) => {
    const { x, y } = props;

    return (
        <div className="cell" style={{
            left: `${CELL_SIZE * x + 1}px`,
            top: `${CELL_SIZE * y + 1}px`,
            width: `${CELL_SIZE - 1}px`,
            height: `${CELL_SIZE - 1}px`,
        }} />
    );
}

function App() {

    const rows = PANEL_HEIGHT / CELL_SIZE;
    const cols = PANEL_WIDTH / CELL_SIZE;

    const createEmptyList = () => {
        let cells = [];
        for (let y = 0; y < rows; y++) {
            cells[y] = [];
            for (let x = 0; x < cols; x++) {
                cells[y][x] = false;
            }
        }
        return cells;
    };

    const [board, setBoard] = useState(createEmptyList());
    const [isRunning, setIsRunning] = useState(false);
    const [generation, setGeneration] = useState(0);
    const [cycle, setCycle] = useState(300);
    const panelRef = useRef();

    const cellList = useMemo(() => {
        let cells = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x <cols; x++) {
                if (board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }, [board, rows, cols])



    const handleClear = () => {
        setBoard(createEmptyList());
        setIsRunning(false);
        setGeneration(0);
    }

    const handleRandom = () => {
        handleClear()
        let tempBoard = createEmptyList();
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                tempBoard[y][x] = (Math.random() >= 0.7);
            }
        }
        setBoard(tempBoard);
    }


    const runGame = () => {
        setIsRunning(true);
    }

    const stopGame = () => {
        setIsRunning(false);
    }


    const handleClick = (event) => {

        const rect = panelRef.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        let tempBoard = [...board];
        if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
            tempBoard[y][x] = !tempBoard[y][x];
        }

        setBoard(tempBoard);
    }
    const handleCycleChange = (event) => {
        setCycle(event.target.value)
    }


    const calculateNeighbors = (board, x, y) => {
        let neighborsCount = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < cols && y1 >= 0 && y1 < rows && board[y1][x1]) {
                neighborsCount++;
            }
        }

        return neighborsCount;
    }

    const nextGenetation = () => {
        let newBoard = createEmptyList();

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let neighbors = calculateNeighbors(board, x, y);
                if (board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        setBoard(newBoard);
        setGeneration(generation + 1);
    }

    useEffect(() => {
        let timer = null;
        if(isRunning) {
            timer = setTimeout(() => {
                nextGenetation();
            }, cycle);
        }
        return () => clearTimeout(timer);
    }, [generation ,isRunning])



    return (
        <div className="gameOfLife">
        <h1>Conway's Game of Life</h1>
        <div>
            <div className='panel' 
                onClick={handleClick}
                ref={panelRef}
                style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}>
                {cellList.map(cell => (
                    <Cell x={cell.x} y={cell.y} key={`${cell.x}-${cell.y}`}/>
                ))}
            </div>
            <div className="controls">
                <div className="generation">Generation:<span className="generationText">{generation}</span></div>
                <button className="button" onClick={isRunning ? stopGame : runGame}>{isRunning ? 'Stop' : 'Run'}</button>
                <button className="button" onClick={handleRandom}>Random</button>
                <button className="button" onClick={handleClear}>Clear</button>
                <div className="cycleTitle">Cycle(ms): </div>
                <input className="cycleInput" value={cycle} onChange={handleCycleChange} />
            </div>
        </div>
        </div>
    );
}

export default App;
