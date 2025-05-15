// app/spells/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from './page.module.css';

interface Spell {
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function SpellList() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchSpells();
  }, []);

  useEffect(() => {
    filterSpells();
  }, [searchTerm, spells]);

  const fetchSpells = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/spells');
      setSpells(response.data);
      setFilteredSpells(response.data);
    } catch (error) {
      console.error("Error fetching spells:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSpells = () => {
    if (!searchTerm.trim()) {
      setFilteredSpells(spells);
      return;
    }
    
    const filtered = spells.filter((spell: Spell) =>
      spell.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpells(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filterSpells();
    }
  };

  return (
    <div className={styles.spellListContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search spells by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
          aria-label="Search spells"
        />
      </div>
      
      <div className={styles.viewToggle}>
        <button 
          onClick={() => setViewMode('list')} 
          className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
          aria-label="List view"
          title="List view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
          </svg>
        </button>
        <button 
          onClick={() => setViewMode('grid')} 
          className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
          aria-label="Grid view"
          title="Grid view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading spells...</span>
        </div>
      ) : filteredSpells.length === 0 ? (
        <div className={styles.noResults}>No spells found matching your search.</div>
      ) : viewMode === 'list' ? (
        <table className={styles.spellTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Spell Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpells.map((spell) => (
              <tr key={spell.id} className={styles.spellRow}>
                <td className={styles.spellCell}>
                  <Link href={`/spells/${spell.id}`} className={styles.spellLink}>
                    {spell.name}
                  </Link>
                </td>
                <td className={styles.spellCell}>
                  {spell.description && spell.description.length > 80
                    ? `${spell.description.substring(0, 80)}...`
                    : spell.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.cardGrid}>
          {filteredSpells.map((spell) => (
            <Link key={spell.id} href={`/spells/${spell.id}`} className={styles.spellCard}>
              <div className={styles.spellName}>{spell.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
