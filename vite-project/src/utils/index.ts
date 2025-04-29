export const generateNodes = (n: number): { number: number; countdown: number | null; position: { top: number; left: number }; isClicked: boolean }[] => {
    const nodesArray = Array.from({ length: n }, (_, index) => {
      const randomTop = Math.abs(Math.random() * window.innerHeight*0.8 - 50)*100/(window.innerHeight*0.8);
      const randomLeft = Math.abs(Math.random() * window.innerWidth*0.8 - 50)*100/(window.innerWidth*0.8);

      return {
        number: index + 1,
        countdown: null,
        position: { top: randomTop, left: randomLeft },
        isClicked: false,
      };
    });
    return nodesArray; 
};
