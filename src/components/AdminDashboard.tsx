import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  Lock, 
  Key, 
  Eye, 
  Plus, 
  Trash2,
  Table,
  Check
} from 'lucide-react';
import { ExcelInspectionReport, QuranDataset, TopicAssociation, GeoLocation } from '../types/quran';
import { 
  getActiveDataset, 
  setActiveDataset, 
  resetToBundledDataset, 
  getSavedInspectionReport 
} from '../utils/quranData';
import { inspectAndParseExcelFile, exportDatasetToExcel } from '../utils/excelImporter';
import { CURATED_TOPIC_ASSOCIATIONS } from '../data/topics';
import { GEO_LOCATIONS } from '../data/places';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active dataset & report state
  const [dataset, setDataset] = useState<QuranDataset>(getActiveDataset());
  const [inspectionReport, setInspectionReport] = useState<ExcelInspectionReport | null>(getSavedInspectionReport());
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Admin tabs
  const [adminTab, setAdminTab] = useState<'excel' | 'topics' | 'locations'>('excel');

  // Topic associations state for admin
  const [topicList, setTopicList] = useState<TopicAssociation[]>(CURATED_TOPIC_ASSOCIATIONS);
  const [newTopicVerseKey, setNewTopicVerseKey] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState<TopicAssociation['category']>('nature');
  const [newTopicConnType, setNewTopicConnType] = useState<'direct' | 'thematic'>('direct');
  const [newTopicExplanation, setNewTopicExplanation] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo passcode
    if (pinInput.trim() === 'admin123' || pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setUploadSuccessMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const { verses, report } = inspectAndParseExcelFile(buffer, file.name);

      const surahsFoundCount = report.validationSummary.surahsFoundCount;
      const newDataset: QuranDataset = {
        edition: 'custom.excel',
        translator: 'Abul A\'la Maududi / Custom',
        title: file.name,
        totalSurahs: surahsFoundCount,
        totalVerses: verses.length,
        surahs: dataset.surahs,
        verses
      };

      setActiveDataset(newDataset, report);
      setDataset(newDataset);
      setInspectionReport(report);
      setUploadSuccessMessage(`Successfully imported and validated ${verses.length} verses from "${file.name}" across ${surahsFoundCount} Surahs.`);
    } catch (err: any) {
      alert(`Excel Import Error: ${err.message || 'Failed to parse Excel workbook'}`);
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExportExcel = () => {
    exportDatasetToExcel(dataset.verses, dataset.surahs, 'quran-moududi-export.xlsx');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to the default authentic Maududi dataset (6,236 verses)?')) {
      resetToBundledDataset();
      const fresh = getActiveDataset();
      setDataset(fresh);
      setInspectionReport(getSavedInspectionReport());
      setUploadSuccessMessage('Reset to bundled authentic Maududi Quran dataset successfully.');
    }
  };

  const handleAddTopicAssociation = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = newTopicVerseKey.trim().split(':');
    if (parts.length !== 2) {
      alert('Please enter a valid Verse Key, e.g. "2:255"');
      return;
    }
    const sNum = parseInt(parts[0], 10);
    const aNum = parseInt(parts[1], 10);
    if (!sNum || !aNum) {
      alert('Invalid verse reference numbers');
      return;
    }

    const newAssoc: TopicAssociation = {
      id: `custom-top-${Date.now()}`,
      topicId: newTopicCategory,
      category: newTopicCategory,
      topicName: newTopicName.trim(),
      verseKey: `${sNum}:${aNum}`,
      surahNumber: sNum,
      ayahNumber: aNum,
      connectionType: newTopicConnType,
      relevanceExplanation: newTopicExplanation.trim()
    };

    setTopicList([newAssoc, ...topicList]);
    setNewTopicVerseKey('');
    setNewTopicName('');
    setNewTopicExplanation('');
    alert(`Successfully added topic mapping for ${newAssoc.verseKey}!`);
  };

  const handleDeleteTopic = (id: string) => {
    setTopicList(topicList.filter(t => t.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold font-heading text-stone-900 dark:text-stone-100">
              Administrator Access
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Protected area for Excel dataset validation, topic associations, and geographical location management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
                Admin Passphrase / PIN
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter admin passcode (default: admin123)"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              {pinError && (
                <p className="text-xs text-rose-600 mt-1">
                  Incorrect PIN. Please use the demo PIN: <code className="font-bold">admin123</code>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-md shadow-emerald-950/20"
            >
              Sign In to Admin
            </button>
          </form>

          <p className="text-[11px] text-stone-400">
            Demo security notice: Use PIN <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">admin123</span> or <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">1234</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-100">
                Administrator Dashboard
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                Authenticated
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Excel inspection, live validation metrics, topic mapping, and geographical registries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Lock Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setAdminTab('excel')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            adminTab === 'excel'
              ? 'bg-emerald-800 text-white'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Excel Dataset & Validation Report</span>
        </button>

        <button
          onClick={() => setAdminTab('topics')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            adminTab === 'topics'
              ? 'bg-emerald-800 text-white'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Topic Associations ({topicList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('locations')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            adminTab === 'locations'
              ? 'bg-emerald-800 text-white'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Geographical Locations ({GEO_LOCATIONS.length})</span>
        </button>
      </div>

      {uploadSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{uploadSuccessMessage}</span>
          </div>
          <button onClick={() => setUploadSuccessMessage(null)} className="text-emerald-700">✕</button>
        </div>
      )}

      {/* TAB 1: Excel Dataset & Inspection Report */}
      {adminTab === 'excel' && (
        <div className="space-y-6">
          {/* Upload & Actions Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 font-heading">
              Excel Dataset Importer & Replacement
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Upload a replacement <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">.xlsx</code>, <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">.xls</code>, or <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">.csv</code> file. The engine will inspect all sheets, detect columns, validate verse keys, and update the platform.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-file-input"
              />
              <label
                htmlFor="excel-file-input"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Replacement Excel (.xlsx)</span>
              </label>

              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs border border-stone-300 dark:border-stone-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Active Dataset (.xlsx)</span>
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold text-xs border border-stone-300 dark:border-stone-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Authentic Default Maududi Dataset</span>
              </button>
            </div>
          </div>

          {/* Inspection Report */}
          {inspectionReport && (
            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    Dataset Inspection & Validation Report
                  </h3>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">
                  {inspectionReport.fileName} ({Math.round(inspectionReport.fileSizeBytes / 1024)} KB)
                </span>
              </div>

              {/* Validation Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Total Valid Verses</p>
                  <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                    {inspectionReport.validationSummary.totalValidVerses}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Surahs Identified</p>
                  <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                    {inspectionReport.validationSummary.surahsFoundCount} / 114
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Duplicates Purged</p>
                  <p className="text-2xl font-bold text-stone-700 dark:text-stone-300 mt-1">
                    {inspectionReport.validationSummary.duplicatesRemovedCount}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Sheets in Workbook</p>
                  <p className="text-2xl font-bold text-stone-700 dark:text-stone-300 mt-1">
                    {inspectionReport.sheetNames.length}
                  </p>
                </div>
              </div>

              {/* Detected Sheet & Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Sheets Found in File
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {inspectionReport.sheetNames.map((sheet) => (
                      <span
                        key={sheet}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                          sheet === inspectionReport.activeSheetName
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200'
                        }`}
                      >
                        {sheet} {sheet === inspectionReport.activeSheetName && '(Active)'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Auto-Mapped Columns
                  </h4>
                  <div className="text-xs space-y-1 text-stone-600 dark:text-stone-300">
                    <div>Surah Number: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{inspectionReport.columnMapping.surahNumberCol || 'Not detected'}</span></div>
                    <div>Ayah Number: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{inspectionReport.columnMapping.ayahNumberCol || 'Not detected'}</span></div>
                    <div>Translation Text: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{inspectionReport.columnMapping.translationCol || 'Not detected'}</span></div>
                    <div>Surah Name: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{inspectionReport.columnMapping.surahNameCol || 'Not detected'}</span></div>
                  </div>
                </div>
              </div>

              {/* Sample Rows Preview */}
              {inspectionReport.sampleRows && inspectionReport.sampleRows.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Sample Imported Rows Preview
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                        <tr>
                          <th className="p-2.5">Surah</th>
                          <th className="p-2.5">Ayah</th>
                          <th className="p-2.5">Verse Key</th>
                          <th className="p-2.5">Surah Name</th>
                          <th className="p-2.5">Maududi Translation Sample</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                        {inspectionReport.sampleRows.map((row, i) => (
                          <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                            <td className="p-2.5 font-bold">{row.SurahNumber || row.surah_number}</td>
                            <td className="p-2.5">{row.AyahNumber || row.ayah_number}</td>
                            <td className="p-2.5 font-mono">{row.VerseKey || `${row.SurahNumber}:${row.AyahNumber}`}</td>
                            <td className="p-2.5">{row.SurahName || row.name_english}</td>
                            <td className="p-2.5 max-w-md truncate">{row.MaududiTranslation || row.translation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Topic Association Management */}
      {adminTab === 'topics' && (
        <div className="space-y-6">
          {/* Add New Association Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 font-heading">
              Map New Verse to Real-World Topic
            </h3>
            <p className="text-xs text-stone-500">
              Create an educational association connecting a Quranic verse to real-world ecology, history, ethics, or society.
            </p>

            <form onSubmit={handleAddTopicAssociation} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Verse Key (e.g. 2:255)</label>
                <input
                  type="text"
                  required
                  value={newTopicVerseKey}
                  onChange={(e) => setNewTopicVerseKey(e.target.value)}
                  placeholder="e.g. 16:68"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Topic Name</label>
                <input
                  type="text"
                  required
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="e.g. Soil Regeneration & Rainfall"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select
                  value={newTopicCategory}
                  onChange={(e) => setNewTopicCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none"
                >
                  <option value="nature">Nature & Universe</option>
                  <option value="water_rain">Water & Rain</option>
                  <option value="animals_plants">Animals & Plants</option>
                  <option value="mountains">Mountains & Topography</option>
                  <option value="ethics">Ethics & Justice</option>
                  <option value="family">Family & Kinship</option>
                  <option value="society_trade">Trade, Finance & Work</option>
                  <option value="history">History & Civilizations</option>
                  <option value="science_reflection">Contemplation & Creation</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Connection Type</label>
                <select
                  value={newTopicConnType}
                  onChange={(e) => setNewTopicConnType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none"
                >
                  <option value="direct">Direct Textual Mention</option>
                  <option value="thematic">Educational Reflection / Thematic</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Why is this verse relevant? (Educational note)</label>
                <textarea
                  required
                  rows={2}
                  value={newTopicExplanation}
                  onChange={(e) => setNewTopicExplanation(e.target.value)}
                  placeholder="Explain why this verse connects to the selected topic..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Topic Association</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Topic Associations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Active Associations ({topicList.length})
            </h4>
            <div className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
              {topicList.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 dark:text-stone-100">{t.topicName}</span>
                      <span className="font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {t.verseKey}
                      </span>
                      <span className="text-[10px] text-stone-400 capitalize">
                        {t.category.replace('_', ' ')} • {t.connectionType}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 line-clamp-1">{t.relevanceExplanation}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteTopic(t.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-600 shrink-0"
                    title="Remove topic association"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Geographical Locations Registry */}
      {adminTab === 'locations' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 font-heading">
              Curated Geographical Locations Registry
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Locations plotted on the Interactive World Map. Distinguishes explicit textual references from historical proposals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GEO_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">{loc.name}</h4>
                  <span className="font-mono text-stone-400">{loc.modernCountry}</span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 line-clamp-2">{loc.historicalBackground}</p>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Certainty: {loc.certainty}</span>
                  <span>{loc.relevantVerses.length} Verses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
