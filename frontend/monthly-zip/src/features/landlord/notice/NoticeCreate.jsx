import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './NoticeCreate.module.css';
import BackArrowIcon from '../../../assets/icons/arrow_back.svg';

function NoticeCreate() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://j12d109.p.ssafy.io/api/buildings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setBuildings(response.data.result);
          if (response.data.result.length > 0) {
            setSelectedBuilding(response.data.result[0].id.toString());
          }
        }
      } catch (error) {
        setError('건물 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching buildings:', error);
      }
    };

    fetchBuildings();
  }, []);

  const handleSubmit = async () => {
    if (!selectedBuilding || !title.trim() || !content.trim()) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const requestData = {
        buildingId: selectedBuilding,
        title: title.trim(),
        content: content.trim()
      };
      
      console.log('Request payload:', requestData);
      
      const response = await axios.post('https://j12d109.p.ssafy.io/api/notices', 
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        navigate('/landlord/notice');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError('해당 건물이 존재하지 않습니다.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || '필수 항목을 모두 입력해주세요.');
      } else if (error.response?.status === 500) {
        console.error('Server response:', error.response.data);
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('공지사항 등록에 실패했습니다.');
      }
      console.error('Error creating notice:', error);
    }
  };

  const handleBack = () => {
    navigate('/landlord/notice');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={BackArrowIcon} alt="뒤로 가기" />
        </button>
        <h1 className={styles.headerTitle}>공지사항 작성</h1>
      </header>

      <main className={styles.content}>
        <div className={styles.formGroup}>
          <label className={styles.label}>건물 선택</label>
          <select
            className={styles.select}
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
          >
            <option value="">건물을 선택하세요</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.buildingName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>내용</label>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </main>

      <footer className={styles.footer}>
        <button className={styles.cancelButton} onClick={handleBack}>
          취소
        </button>
        <button className={styles.submitButton} onClick={handleSubmit}>
          완료
        </button>
      </footer>
    </div>
  );
}

export default NoticeCreate;
