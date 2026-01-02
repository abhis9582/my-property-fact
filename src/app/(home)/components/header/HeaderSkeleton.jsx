"use client";

/**
 * Loading skeleton for Header component
 * Shows while Header data is being fetched
 */
export default function HeaderSkeleton() {
  return (
    <div 
      className="d-flex justify-content-between align-items-center px-2 px-lg-4"
      style={{ 
        height: "80px", 
        background: "#fff",
        borderBottom: "1px solid #e0e0e0"
      }}
    >
      <div className="d-flex align-items-center gap-4">
        <div 
          style={{ 
            width: "80px", 
            height: "74px", 
            background: "#f0f0f0",
            borderRadius: "4px"
          }} 
        />
      </div>
      <nav className="d-none d-lg-flex">
        <div className="d-flex gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                width: "60px",
                height: "20px",
                background: "#f0f0f0",
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}













