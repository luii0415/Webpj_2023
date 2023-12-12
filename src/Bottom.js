import "./Bottom.css";

function Bottom() {
  // head - A 아이콘

  return (
    <div className="Bottom">
      <img className="inline" src="images/img_opentype01.png" />
      <div className="inline">
        <p className="p_top">
          본 저작물은 '기상청'에서 '2021'년 작성하여 공공누리 제 1유형으로
          개방한 '기상청_단기예보 ((구)_동네예보) 조회서비스'를 이용하였으며,
        </p>
        <p className="p_bottom">
          해당 저작물은 <a href="https://www.data.go.kr/">'공공데이터포털'</a>,
          'https://www.data.go.kr/' 에서 무료로 다운받으실 수 있습니다.
        </p>
      </div>
    </div>
  );
}

export default Bottom;
