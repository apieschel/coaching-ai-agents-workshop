// app/spells/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './page.module.css';

interface Spell {
  id: number;
  name: string;
  description: string;
  pronunciation: string;
  seenMentioned: string;
  etymology: string;
  notes: string;
  knownPractitioners: string[];
  additionalItems: string;
  image: string;
}

export default function SpellDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [spell, setSpell] = useState<Spell | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchSpell = async () => {
      try {
        const response = await axios.get(`/api/spells/${id}`);
        setSpell(response.data);
      } catch (error) {
        console.error("Error fetching spell:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpell();
    }
  }, [id]);

  const deleteSpell = async () => {
    try {
      await axios.delete(`/api/spells/${id}`);
      router.push('/spells');
    } catch (error) {
      console.error("Error deleting spell:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Loading spell details...</span>
      </div>
    );
  }

  if (!spell) {
    return (
      <div className={styles.detailContainer}>
        <h2 className={styles.spellTitle}>Spell Not Found</h2>
        <Link href="/spells" className={styles.backLink}>Back to Spell List</Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.detailContainer}>
        <h2 className={styles.spellTitle}>{spell.name}</h2>
        
        <div className={styles.detailSection}>
          <span className={styles.detailLabel}>Description:</span>
          <div className={styles.detailContent}>
            {spell.description || <span className={styles.emptyField}>No description available</span>}
          </div>
        </div>
        
        {spell.pronunciation && (
          <div className={styles.detailSection}>
            <span className={styles.detailLabel}>Pronunciation:</span>
            <div className={styles.detailContent}>{spell.pronunciation}</div>
          </div>
        )}
        
        {spell.seenMentioned && (
          <div className={styles.detailSection}>
            <span className={styles.detailLabel}>Seen/Mentioned:</span>
            <div className={styles.detailContent}>{spell.seenMentioned}</div>
          </div>
        )}
        
        {spell.etymology && (
          <div className={styles.detailSection}>
            <span className={styles.detailLabel}>Etymology:</span>
            <div className={styles.detailContent}>{spell.etymology}</div>
          </div>
        )}
        
        {spell.notes && (
          <div className={styles.detailSection}>
            <span className={styles.detailLabel}>Notes:</span>
            <div className={styles.detailContent}>{spell.notes}</div>
          </div>
        )}
        
        {spell.knownPractitioners && spell.knownPractitioners.length > 0 && (
          <div className={styles.detailSection}>
            <span className={styles.detailLabel}>Known Practitioners:</span>
            <div className={styles.detailContent}>{spell.knownPractitioners.join(', ')}</div>
          </div>
        )}
        
        {spell.additionalItems && (
          <div className={styles.detailSection}>
            <span className={styles.detailLabel}>Additional Items:</span>
            <div className={styles.detailContent}>{spell.additionalItems}</div>
          </div>
        )}
        
        <div className={styles.buttonContainer}>
          <button 
            onClick={() => router.push(`/spells/edit/${spell.id}`)} 
            className={`${styles.actionButton} ${styles.editButton}`}
          >
            Edit Spell
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className={`${styles.actionButton} ${styles.deleteButton}`}
          >
            Delete Spell
          </button>
        </div>
        
        <Link href="/spells" className={styles.backLink}>Back to Spell List</Link>
      </div>
      
      {showDeleteModal && (
        <div className={styles.deleteModal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Are you sure you want to delete "{spell.name}"?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.modalButtons}>
              <button 
                onClick={deleteSpell} 
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                Delete
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
