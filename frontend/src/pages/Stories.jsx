import React from "react";

const stories = [
  {
    title:
      "This app helped me calm my mind during stressful exam days. I finally felt supported and less anxious while preparing for tests. Rahul Sharma, CSE, 1st Year",
    img:
      "https://imgs.search.brave.com/IXfTJ9541DFSUEJUKmwyO85_ltnZcDZJUKx-GQ1X3uw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQw/ODU4NDYyNS9waG90/by9oaWdoLXNjaG9v/bC1zdHVkZW50LXVz/aW5nLWxhcHRvcC5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/NHpDMEpMVUEyYkZ0/WmJScTRtVmFaejZU/WkJwZy1WNkl4ODM2/Mk5oYW85OD0"
  },
  {
    title:
      "I struggled with anxiety and sleepless nights for months. This app taught me breathing exercises, gave relatable stories, and helped me manage stress better. Aman Gupta, EEE, 2nd Year",
    img:
      "https://imgs.search.brave.com/4rMZ7AmSUIvl48czL_CfRqGnTEZusBVJpyfrcKP8LZc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91cy4x/MjNyZi5jb20vNDUw/d20vY2xhc3NpZnlp/bWFnZXMvY2xhc3Np/ZnlpbWFnZXMxNzEy/L2NsYXNzaWZ5aW1h/Z2VzMTcxMjAwMjY2/Lzk0ODg5MTY1LWNv/bGxlZ2UtYm95LWlu/LWEtcGFyay5qcGc_/dmVyPTY"
  },
  {
    title:
      "College pressure made me feel lonely and confused. This app became a safe space where I could reflect, track my feelings, and slowly rebuild motivation. Sandeep Kumar, Civil Engineering, 3rd Year",
    img:
      "https://imgs.search.brave.com/bBj1qS4WlLbuWucsKAE4hUCuqv2ls1SK-n_Td57xyzU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9pbmRp/YW4tYXNpYW4tY29s/bGVnZS1zdHVkZW50/LXN0dWR5aW5nLWZy/ZWVsYW5jZXItd29y/a2luZy1sYXB0b3At/YmVhY2gtc3VtbWVy/LWNhZmUtZnJlZWxh/bmNlLXJlbW90ZS13/b3JrLTE1OTM2NDAz/MC5qcGc"
  },
  {
    title:
      "I felt mentally exhausted due to academics and expectations. Using this app daily helped me understand my emotions and stay emotionally stable. Nikhil Reddy, Mechanical Engineering, 2nd Year",
    img:
      "https://imgs.search.brave.com/rEHM_CaSbUhkQeedZb398ljppLUx3KhP9dSLZRIhrv4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDYv/Nzg0LzMyMS9zbWFs/bC9pbmRpYW4tc3R1/ZGVudC1pbWFnZXMt/c3R1ZGVudC13aXRo/LWJvb2tzLWFuZC1i/YWctcGhvdG8uanBn"
  },
  {
    title:
      "This app helped me break my overthinking cycle. Small daily practices improved my focus, reduced stress, and gave me emotional clarity. Vikas Patel, IT, 4th Year",
    img:
      "https://imgs.search.brave.com/0wkDvGEUhPeH2093xyWspokhL931HgScRwzXqwzkiTk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDYv/ODU5LzM1Mi9zbWFs/bC9pbmRpYW4tY29s/bGVnZS1zdHVkZW50/LWltYWdlcy1oaWdo/LWRlZmluaXRpb24t/cGhvdG8uanBn"
  },
  {
    title:
      "During my first year, I felt lost and anxious. This app guided me step by step, helping me understand mental health and take positive action. Praveen Singh, ECE, 1st Year",
    img:
      "https://imgs.search.brave.com/xoxamHknA22fRjRt4JMe1UP6NcDuz9CMJCY4rvUK_KI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by95b3VuZy1pbmRp/YW4tZGVsaXZlcnkt/Ym95LXdpdGgtcGFy/Y2VsLXJvYWRfMTEy/ODYwMy0xNzgzOC5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw/JnE9ODA"
  }
];



export default function Stories(){
  return (
    <section className="section">
      <div className="container">
        <h2>Real stories</h2>
        <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
          {stories.map((s,i)=>(
            <article key={i} className="card">
              <img src={s.img} alt={s.title} style={{borderRadius:12}}/>
              <p style={{marginTop:8}}>{s.title}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
