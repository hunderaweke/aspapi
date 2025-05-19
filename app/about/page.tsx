const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cream max-w-screen ">
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-r from-cyan-50 to-cyan-100 shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4 text-center ">About Us</h1>
            <div className="w-full max-w-6xl mx-auto flex items-center justify-around mb-8">
            <div>
                <h2 className="text-xl font-semibold mb-2">Group Memebers</h2>
                <ul className="list-inside list-none flex flex-col gap-3">
                    <li>Ravi Shankar</li>
                    <li>Shivam Kumar</li>
                    <li>Shivendra Singh</li>
                    <li>Shubham Kumar</li>
                    </ul>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">ID Number</h2>
                <ul className="list-none list-inside flex flex-col gap-3">
                    <li>UGR//14</li>
                    <li>UGR//14</li>
                    <li>UGR//14</li>
                    <li>UGR//14</li>
                </ul>
            </div>
                  </div>
        </div>
    </div>
  );
};

export default AboutPage;
