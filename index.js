// Extension Panel Manager

const STORAGE_KEY = 'ext_panel_manager_state';
const columns = [document.getElementById('extensions_settings'), document.getElementById('extensions_settings2')];
let isEditing = false;
let snapshot = null;
let dragSrc = null;
const markedPanels = new Map();

function loadState() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// 沒有 ID 的面板不參與管理，以免重新載入後對應到不同面板。
function getManagedItems() {
    return columns.flatMap(col => Array.from(col.children).filter(el => el.id && el.querySelector('.inline-drawer-header')));
}

function applyStoredState() {
    if (isEditing) return;

    const stored = loadState();
    const items = getManagedItems();
    const byId = new Map(items.map(el => [el.id, el]));
    const hidden = new Set(stored.hidden || []);
    items.forEach(el => el.classList.toggle('ext-panel-hidden', hidden.has(el.id)));

    const ordered = [[], []];
    (stored.order || []).forEach(({ id, col }) => {
        const el = byId.get(id);
        if (!el) return;
        ordered[col === 2 ? 1 : 0].push(el);
        byId.delete(id);
    });
    const savedPanels = new Set(ordered.flat());
    // 已儲存面板依序填入目標欄既有的位置，多出的面板附加在後。
    const layouts = columns.map((col, index) => {
        const panels = ordered[index];
        let next = 0;
        const children = Array.from(col.children).filter(el => !savedPanels.has(el) || panels.includes(el));
        const layout = children.map(el => savedPanels.has(el) ? panels[next++] : el);
        return layout.concat(panels.slice(next));
    });

    // 只移動已儲存的面板，保留其他子元素的相對位置。
    layouts.forEach((layout, index) => {
        const col = columns[index];
        let next = null;
        for (const el of layout.reverse()) {
            if (savedPanels.has(el) && (el.parentElement !== col || el.nextElementSibling !== next)) {
                col.insertBefore(el, next);
            }
            next = el;
        }
    });
}

const observer = new MutationObserver(() => applyStoredState());

function collapseAllDrawers() {
    document.querySelectorAll('#extensions_settings .inline-drawer-content, #extensions_settings2 .inline-drawer-content').forEach(content => {
        if (content.style.display === 'none') return;
        content.style.display = 'none';
        const icon = content.previousElementSibling?.querySelector('.inline-drawer-icon');
        if (icon) {
            icon.classList.remove('up', 'fa-circle-chevron-up');
            icon.classList.add('down', 'fa-circle-chevron-down');
        }
    });
}

function enterEditMode() {
    if (isEditing) return;
    isEditing = true;
    const items = getManagedItems();
    snapshot = {
        children: columns.map(col => Array.from(col.childNodes)),
        hidden: new Map(items.map(el => [el, el.classList.contains('ext-panel-hidden')])),
    };

    collapseAllDrawers();
    columns.forEach(col => col.classList.add('ext-panel-editing'));
    items.forEach(container => {
        const header = container.querySelector('.inline-drawer-header');
        markedPanels.set(container, { header, draggable: header.getAttribute('draggable') });
        container.classList.add('ext-panel-managed');
        header.draggable = true;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'ext-panel-checkbox';
        checkbox.checked = !container.classList.contains('ext-panel-hidden');
        checkbox.title = '顯示此面板';
        checkbox.onclick = e => e.stopPropagation();
        checkbox.onchange = () => {
            container.classList.toggle('ext-panel-hidden', !checkbox.checked);
            updateFloatingCount();
        };
        header.insertBefore(checkbox, header.firstChild);
    });

    const wrapper = document.createElement('div');
    wrapper.id = 'ext-panel-float-wrapper';
    wrapper.innerHTML = `
        <div id="ext-panel-float-panel">
            <span id="ext-panel-float-count"></span>
            <div id="ext-panel-float-finish" class="menu_button menu_button_icon" title="確認">
                <i class="fa-solid fa-check"></i>
            </div>
            <div id="ext-panel-float-cancel" class="menu_button menu_button_icon" title="取消">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>`;
    document.getElementById('rm_extensions_block').appendChild(wrapper);
    wrapper.querySelector('#ext-panel-float-finish').onclick = confirmEditMode;
    wrapper.querySelector('#ext-panel-float-cancel').onclick = cancelEditMode;
    updateFloatingCount();
    updateManageBtn(true);
}

function managedTarget(e) {
    const panel = e.target.closest('.ext-panel-managed');
    return panel?.parentElement === e.currentTarget ? panel : null;
}

function clearDragIndicators() {
    columns.forEach(col => col.querySelectorAll('.ext-panel-drag-over').forEach(el => el.classList.remove('ext-panel-drag-over')));
}

function onDragStart(e) {
    const panel = managedTarget(e);
    if (!isEditing || !panel || e.target !== markedPanels.get(panel)?.header) return;
    dragSrc = panel;
    panel.classList.add('ext-panel-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', panel.id);
}

function onDragOver(e) {
    if (!isEditing || !dragSrc) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    clearDragIndicators();
    const panel = managedTarget(e);
    if (panel && panel !== dragSrc) panel.classList.add('ext-panel-drag-over');
}

function onDragLeave(e) {
    const panel = managedTarget(e);
    if (panel && !panel.contains(e.relatedTarget)) panel.classList.remove('ext-panel-drag-over');
}

function onDrop(e) {
    if (!isEditing || !dragSrc) return;
    e.preventDefault();
    const panel = managedTarget(e);
    if (panel && panel !== dragSrc) {
        const range = document.createRange();
        range.selectNodeContents(panel);
        const rect = range.getBoundingClientRect();
        e.currentTarget.insertBefore(dragSrc, e.clientY < rect.top + rect.height / 2 ? panel : panel.nextSibling);
    } else if (!panel) {
        e.currentTarget.appendChild(dragSrc);
    }
    clearDragIndicators();
}

function onDragEnd() {
    dragSrc?.classList.remove('ext-panel-dragging');
    dragSrc = null;
    clearDragIndicators();
}

function blockHeaderClick(e) {
    if (isEditing && managedTarget(e) && e.target.closest('.inline-drawer-header') && !e.target.closest('.ext-panel-checkbox')) {
        e.stopPropagation();
        e.preventDefault();
    }
}

function updateFloatingCount() {
    const items = Array.from(markedPanels.keys());
    const visible = items.filter(el => !el.classList.contains('ext-panel-hidden')).length;
    document.getElementById('ext-panel-float-count').textContent = `顯示 ${visible} / ${items.length}`;
}

function confirmEditMode() {
    if (!isEditing) return;
    const items = getManagedItems().filter(el => markedPanels.has(el));
    const currentIds = new Set(items.map(el => el.id));
    const stored = loadState();
    const order = items.map(el => ({ id: el.id, col: columns.indexOf(el.parentElement) + 1 }));
    let next = 0;
    const mergedOrder = (stored.order || []).map(entry => currentIds.has(entry.id) ? order[next++] : entry);
    const hidden = (stored.hidden || []).filter(id => !currentIds.has(id));
    items.forEach(el => {
        if (el.classList.contains('ext-panel-hidden')) hidden.push(el.id);
    });
    saveState({ hidden, order: mergedOrder.concat(order.slice(next)) });
    snapshot = null;
    cleanupEditUI();
    toastr?.success('面板設定已儲存');
}

function cancelEditMode() {
    if (!isEditing) return;
    snapshot.children.forEach((children, index) => children.forEach(node => columns[index].appendChild(node)));
    snapshot.hidden.forEach((hidden, el) => el.classList.toggle('ext-panel-hidden', hidden));
    snapshot = null;
    cleanupEditUI();
    toastr?.info('已取消，還原至修改前');
}

function cleanupEditUI() {
    const hasNewPanels = getManagedItems().some(el => !markedPanels.has(el));
    columns.forEach(col => col.classList.remove('ext-panel-editing'));
    markedPanels.forEach(({ header, draggable }, panel) => {
        panel.classList.remove('ext-panel-managed', 'ext-panel-dragging', 'ext-panel-drag-over');
        if (draggable === null) header.removeAttribute('draggable');
        else header.setAttribute('draggable', draggable);
        header.querySelector('.ext-panel-checkbox')?.remove();
    });
    markedPanels.clear();
    dragSrc = null;
    document.getElementById('ext-panel-float-wrapper')?.remove();
    observer.takeRecords();
    isEditing = false;
    if (hasNewPanels) applyStoredState();
    updateManageBtn(false);
}

function updateManageBtn(active) {
    document.getElementById('ext-panel-manage-btn')?.classList.toggle('active', active);
}

function createManageButton() {
    const btn = document.createElement('div');
    btn.id = 'ext-panel-manage-btn';
    btn.className = 'menu_button menu_button_icon interactable';
    btn.tabIndex = 0;
    btn.setAttribute('role', 'button');
    btn.title = '管理擴充功能面板';
    btn.innerHTML = '<i class="fa-solid fa-table-columns"></i><span>管理面板</span>';
    btn.onclick = () => isEditing ? cancelEditMode() : enterEditMode();
    document.getElementById('third_party_extension_button').insertAdjacentElement('afterend', btn);
}

createManageButton();
columns.forEach(col => {
    col.addEventListener('click', blockHeaderClick, true);
    col.addEventListener('dragstart', onDragStart);
    col.addEventListener('dragover', onDragOver);
    col.addEventListener('dragleave', onDragLeave);
    col.addEventListener('drop', onDrop);
    col.addEventListener('dragend', onDragEnd);
});
applyStoredState();
columns.forEach(col => observer.observe(col, { childList: true, subtree: true }));
setTimeout(() => observer.disconnect(), 15000);
