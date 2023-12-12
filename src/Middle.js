import React, { useState, useEffect } from "react";
import "./Middle.css";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className="clockStyle">
      {time.getHours()} : {time.getMinutes()}
    </div>
  );
}

function Button({ isActive, onClick, children }) {
  return (
    <button className={`button ${isActive ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Loc_Button({ isActive, onClick, children }) {
  return (
    <button
      className={`loc_button ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Middle() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const isMorning = currentHour >= 6 && currentHour < 17;
  const [isActive, setIsActive] = useState(!isMorning);

  const [buttonStates, setButtonStates] = useState({
    seoul: true,
    busan: false,
    gyeonggi: false,
    incheon: false,
    gangwon: false,
  });

  const handleButtonClick = (city) => {
    setButtonStates({
      seoul: false,
      busan: false,
      gyeonggi: false,
      incheon: false,
      gangwon: false,
      [city]: true,
    });

    switch (city) {
      case "seoul":
        handleCityButtonClick("60", "127");
        break;
      case "busan":
        handleCityButtonClick("98", "76");
        break;
      case "gyeonggi":
        handleCityButtonClick("60", "120");
        break;
      case "incheon":
        handleCityButtonClick("55", "124");
        break;
      case "gangwon":
        handleCityButtonClick("73", "134");
        break;
      default:
        break;
    }
  };

  const current = new Date();
  const year = current.getFullYear();
  const month = (current.getMonth() + 1).toString().padStart(2, "0");
  const date = current.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}${month}${date}`;
  const currentMinute = current.getMinutes();
  let formattedTime, printHour, printMinute;

  if (0 <= currentMinute && currentMinute <= 40) {
    formattedTime = `${String(currentHour - 1).padStart(2, "0")}00`;
    printHour = currentHour - 1;
    printMinute = "30";
  } else {
    printHour = currentHour;
    printMinute = "30";
    formattedTime = `${String(currentHour).padStart(2, "0")}00`;
  }

  const [weatherData, setWeatherData] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [precipitationType, setPrecipitationType] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [windChill, setWindChill] = useState(null);
  const [rainHour, setRainHour] = useState(null);
  const handleCityButtonClick = async (x, y) => {
    var val_x = x;
    var val_y = y;
    await fetchWeatherData(val_x, val_y);
  };

  const fetchWeatherData = async (val_x, val_y) => {
    const url =
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
    const serviceKey =
      "IEWoUlU0P1zQW3YrM7GJsaovDsQmJjd6u8gI1tS4Imz3SitbKQ7e0psu6c+mZHVzDPTINJEjwRk5XFNg6FvUcw==";
    const baseDate = formattedDate;
    const baseTime = formattedTime;

    const queryParams = new URLSearchParams({
      serviceKey: serviceKey,
      pageNo: "1",
      numOfRows: "10",
      dataType: "JSON",
      base_date: baseDate,
      base_time: baseTime,
      nx: val_x,
      ny: val_y,
    });

    try {
      const response = await fetch(`${url}?${queryParams}`);
      const data = await response.text();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData("60", "127");
  }, []);

  useEffect(() => {
    if (weatherData) {
      const parsedData = JSON.parse(weatherData);
      const temperatureData = parsedData.response.body.items.item.find(
        (item) => item.category === "T1H"
      );
      const humidityData = parsedData.response.body.items.item.find(
        (item) => item.category === "REH"
      );
      const precipitationTypeData = parsedData.response.body.items.item.find(
        (item) => item.category === "PTY"
      );
      const windSpeedData = parsedData.response.body.items.item.find(
        (item) => item.category === "WSD"
      );
      const rainHourData = parsedData.response.body.items.item.find(
        (item) => item.category === "RN1"
      );
      if (temperatureData) {
        setTemperature(temperatureData.obsrValue);
      }
      if (humidityData) {
        setHumidity(humidityData.obsrValue);
      }

      if (precipitationTypeData) {
        let precipitationText = "";
        switch (precipitationTypeData.obsrValue) {
          case "0":
            precipitationText = "없음";
            setPrecipitationType(precipitationText);
            setRainHour(rainHourData.obsrValue);
            break;
          case "1":
            precipitationText = "비";
            setPrecipitationType(precipitationText);
            setRainHour(rainHourData.obsrValue);
            break;
          case "2":
            precipitationText = "비나 눈";
            setPrecipitationType(precipitationText);
            setRainHour(rainHourData.obsrValue);
            break;
          case "3":
            precipitationText = "눈";
            setPrecipitationType(precipitationText);
            setRainHour(rainHourData.obsrValue);
            break;
          case "7":
            precipitationText = "눈 날림";
            setPrecipitationType(precipitationText);
            setRainHour(rainHourData.obsrValue);
            break;
          default:
            break;
        }
      }
      if (windSpeedData) {
        setWindSpeed(windSpeedData.obsrValue);
        const windSpeedInKmh = windSpeedData.obsrValue * 3.6; // m/s to km/h
        if (
          temperatureData &&
          temperatureData.obsrValue <= 10 &&
          windSpeedInKmh >= 1.3
        ) {
          const windChillFormula =
            13.12 +
            0.6215 * temperatureData.obsrValue -
            11.37 * Math.pow(windSpeedInKmh, 0.16) +
            0.3965 * Math.pow(windSpeedInKmh, 0.16) * temperatureData.obsrValue;
          const calculatedWindChill = Math.round(windChillFormula * 10) / 10; // 체감온도를 소수점 아래 첫째 자리까지 표시
          setWindChill(calculatedWindChill);
        }
      }
    }
  }, [weatherData]);

  function getSelectedLocationMessage() {
    let selectedLocation = "";
    Object.keys(buttonStates).forEach((city) => {
      if (buttonStates[city]) {
        switch (city) {
          case "seoul":
            selectedLocation = "서울";
            break;
          case "busan":
            selectedLocation = "부산";
            break;
          case "gyeonggi":
            selectedLocation = "경기";
            break;
          case "incheon":
            selectedLocation = "인천";
            break;
          case "gangwon":
            selectedLocation = "강원";
            break;
          default:
            break;
        }
      }
    });
    return selectedLocation;
  }

  console.log(weatherData);
  return (
    <div className={`Middle ${isActive ? "active" : ""}`}>
      <div className="topLeft">
        <div className="clock">
          <Clock />
        </div>
        <div>
          <Button isActive={isActive} onClick={() => setIsActive(!isActive)}>
            <span></span>
          </Button>
        </div>
      </div>
      <div className="today">
        <p className="to_print">
          {current.getFullYear()}년 {current.getMonth() + 1}월{" "}
          {current.getDate()}일
        </p>{" "}
        <p className="to_print">
          기준시각은 {printHour}시 {printMinute}분 입니다.{" "}
        </p>
      </div>
      <p className="space"></p>
      <p className="Big_space"></p>
      <div className="content">
        <div className="left">
          <div className="weather_info location_info">
            현재 지역은? {getSelectedLocationMessage()}입니다
          </div>
          <p className="space"></p>
          {temperature && (
            <div className="weather_info">
              현재 기온은? {temperature}℃ 입니다
            </div>
          )}
          {humidity && (
            <div className="weather_info">습도는? {humidity}% 입니다</div>
          )}
          <div className="weather_info">
            강수형태는? {precipitationType}입니다
          </div>
          {precipitationType !== "없음" && (
            <div className="weather_info">1시간 강수량은? {rainHour}입니다</div>
          )}
          {windSpeed && (
            <div className="weather_info">풍속은? {windSpeed} m/s 입니다</div>
          )}

          {temperature <= 10 && (
            <div className="weather_info">체감온도는? {windChill}℃ 입니다</div>
          )}
        </div>
        <div className="right">
          <li>
            <Loc_Button
              isActive={buttonStates.seoul}
              onClick={() => handleButtonClick("seoul")}
            >
              서울
            </Loc_Button>
          </li>
          <li>
            <Loc_Button
              isActive={buttonStates.busan}
              onClick={() => handleButtonClick("busan")}
            >
              부산
            </Loc_Button>
          </li>
          <li>
            <Loc_Button
              isActive={buttonStates.gyeonggi}
              onClick={() => handleButtonClick("gyeonggi")}
            >
              경기
            </Loc_Button>
          </li>
          <li>
            <Loc_Button
              isActive={buttonStates.incheon}
              onClick={() => handleButtonClick("incheon")}
            >
              인천
            </Loc_Button>
          </li>
          <li>
            <Loc_Button
              isActive={buttonStates.gangwon}
              onClick={() => handleButtonClick("gangwon")}
            >
              강원
            </Loc_Button>
          </li>
        </div>
      </div>
    </div>
  );
}

export default Middle;
