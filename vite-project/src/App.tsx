import React, { useState, useEffect,useRef } from 'react';
import { NodeComponent } from './components/node';
import { generateNodes } from './utils';
import {useCountdownIntervalStore, useResultStore, usePointStore} from './store';
interface Node{
  number: number;
  countdown: number | null; 
  position: { top: number; left: number };
  isClicked: boolean;
}

const Game: React.FC = () => {

  const [nodes, setNodes] = useState<Node[]>([]); // Danh sách node
  const [gameState, setGameState] = useState<'start' | 'playing'>('start'); // Trạng thái game
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]); // Danh sách timeout
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false); // Trạng thái auto play
  const currentNodeRef = useRef<number>(1); // Node hiện tại
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); // Bộ đếm thời gian
  const timeDisplayRef = useRef<HTMLSpanElement>(null); // Thành phần hiển thị thời gian
  const autoPlayTimeoutRef = useRef<number[]>([]); // Danh sách timeout auto play
  const { points, setPoints } = usePointStore(); // Lấy số điểm nhập vào
  const { intervalIds } = useCountdownIntervalStore(); // Lấy danh sách idInterval của bộ đếm ngược thời gian
  const { resultState, setResultState } = useResultStore(); // Lấy trạng thái kết quả trò chơi

  useEffect(() => {
    if (gameState === 'playing') {
      if (nodes.length === 0) { // Khi số lượng node bị ẩn hết thì hoàn thành game
        if (timerRef.current) { 
          clearInterval(timerRef.current);
        }
        if(timeoutIds.length > 0) { 
          timeoutIds.forEach((id) => clearTimeout(id));
          setTimeoutIds([]);
        }
        setGameState('start');
        setResultState('All cleared');
        setIsAutoPlaying(false);
      }
    }
  }, [nodes]);

  // Bắt đầu đếm thời gian
  const startTimer = () => {
    let initialTime = 0; 
    // Hủy bỏ bộ đếm thời gian trước đó
    if (timerRef.current) clearInterval(timerRef.current);
    // Tạo bộ đếm thời gian mới
    timerRef.current = setInterval(() => {
      initialTime += 0.1;
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = initialTime.toFixed(1) + 's';
      }
    }, 100);
  };

  // Bắt đầu hoặc restart game
  const handlePlay = () => {
    // Hủy tất cả timeout trước khi reset
    if (timeoutIds && timeoutIds.length > 0) {
        timeoutIds.forEach((id) => clearTimeout(id));
        setTimeoutIds([]);
    }
    // Kiểm tra điều kiện đầu vào
    if (points === '' || parseInt(points) <= 0 || !/^\d+$/.test(points)) {
      alert('Please enter the number of nodes');
      return;
    }
    // Tạo danh sách node mới
    const nodeList = generateNodes(parseInt(points));
    setNodes(nodeList);
    currentNodeRef.current = 1;
    setGameState('playing');
    setResultState('None');
    // Thiết lập bộ đếm thời gian
    startTimer();
  };

  // Xử lý khi bấm vào node
  const handleNodeClick = (node: number) => {

    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.number === node
          ? { ...n, countdown: 3.0 , isClicked: true} // Thiết lập countdown là 2s và isClicked là true
          : n
      )
    );
    if (node === currentNodeRef.current) {
      // Nếu bấm đúng thứ tự, bắt đầu đếm ngược
      currentNodeRef.current = currentNodeRef.current + 1;

      // Sau 3s thì node sẽ biến mất
      const timeoutId = setTimeout(() => {
        setNodes((prevNodes) => prevNodes.filter((n) => n.number !== node));
      }, 3000);

      setTimeoutIds((prev) => [...prev, timeoutId]);

    } else {  
      // Nếu click sai node, dừng game
      if(timeoutIds.length > 0) {
        timeoutIds.forEach((id) => clearTimeout(id));
        setTimeoutIds([]);
      }
      if(intervalIds.length > 0) {
        intervalIds.forEach((id) => clearInterval(id)); 
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setResultState('Game over');
    }

  };

  // Bắt đầu auto play hoặc dừng auto play
  const handlePlayAuto = () => {
    if (isAutoPlaying) {
      // dừng auto play
      autoPlayTimeoutRef.current.forEach((id) => clearTimeout(id));
      autoPlayTimeoutRef.current = [];
      setIsAutoPlaying(false);
    } else {
      // bắt đầu auto play
      setIsAutoPlaying(true);
      for(let i = 0; i < nodes.length; i++) {
        const timeoutId = setTimeout(() => {
          handleNodeClick(nodes[i].number);
        }, 1000 * i);
        autoPlayTimeoutRef.current.push(timeoutId);
      }
    }
  }

  // Xử lý input points
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
      }}
    >
      <div style={{ textAlign: 'left' }}>
        
        <h2 
            style={{
              color: resultState === 'All cleared' ? 'green' : resultState === 'Game over' ? 'red' : 'black',
              marginBottom: '10px',
            }}
          >
            {resultState === 'None' ? `Let's play` : resultState}
        </h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ minWidth: '50px' }}>Points:</label>
          <input value={points} onChange={handleInputChange} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ minWidth: '50px' }}>Time:</label>
          <span ref={timeDisplayRef}>0.0s</span>
        </div>

        {gameState === 'start' ? (          
            <button onClick={handlePlay} style={{ padding: '0px 20px' }}>Play</button>
        ) : (  
            <button onClick={handlePlay} style={{ padding: '0px 20px' }}>Restart</button>
        )}
        {
          gameState === 'playing' && (
            <button onClick={handlePlayAuto} style={{ padding: '0px 20px' }}>
              {isAutoPlaying ? 'Auto Play Off' : 'Auto Play On'}
            </button>
          )
        }
        <div
          style={{
            position: 'relative', 
            display: 'block',
            width: '80vw', 
            height: '80vh', 
            border: '2px solid black',
            marginTop: '10px',
          }}
        >
          {nodes.map((node) => (
            <NodeComponent
              key={node.number}
              number={node.number}
              visible={gameState === 'playing'} 
              countdown={node.countdown}
              position={node.position}
              isClicked={node.isClicked}
              onClick={handleNodeClick}
            />
          ))}
        </div>
        {gameState === 'playing' && (currentNodeRef.current - 1) !== parseInt(points) && resultState !== 'Game over' ? <div><span>Next: {currentNodeRef.current}</span></div> : <div></div>}

      </div>
    </div>
  );
};

export default Game;
