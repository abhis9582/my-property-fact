"use client";

/**
 * Loading skeleton for Footer component
 * Shows while Footer data is being fetched
 */
export default function FooterSkeleton() {
  return (
    <div 
      style={{ 
        minHeight: "200px", 
        background: "#f8f9fa",
        padding: "40px 0"
      }}
    >
      <div className="container">
        <div className="row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-md-3">
              <div
                style={{
                  width: "80%",
                  height: "20px",
                  background: "#e0e0e0",
                  borderRadius: "4px",
                  marginBottom: "15px",
                }}
              />
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  style={{
                    width: "60%",
                    height: "15px",
                    background: "#e8e8e8",
                    borderRadius: "4px",
                    marginBottom: "10px",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}














