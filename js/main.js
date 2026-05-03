/* ============================================================
   WebBuilder - Drag & Drop Builder
   ============================================================ */

const Builder = {
    selectedBlock: null,
    blocks: {},
    
    init() {
        this.canvas = document.getElementById('builder-canvas');
        this.emptyState = document.getElementById('empty-state');
        this.siteNameInput = document.getElementById('site-name');
        
        if (!this.canvas) return;
        
        this.defineBlocks();
        this.setupDragDrop();
        this.setupCanvas();
        this.loadSavedSite();
        console.log('Builder initialized');
    },
    
    defineBlocks() {
        this.blocks = {
            hero: {
                name: 'Hero Section',
                icon: 'H',
                html: `<div class="hero-block" style="text-align:center;padding:60px 20px;background:#f8fafc;">
                    <h1 style="font-size:2rem;font-weight:800;margin-bottom:12px;">Welcome</h1>
                    <p style="font-size:1.1rem;color:#64748b;margin-bottom:20px;">Your tagline here</p>
                    <a href="#" style="display:inline-block;padding:14px 30px;background:#6366f1;color:white;border-radius:8px;font-weight:600;">Get Started</a>
                </div>`
            },
            heading: {
                name: 'Heading',
                icon: 'T',
                html: `<div style="padding:20px;"><h2 style="font-size:1.8rem;font-weight:700;">Section Title</h2></div>`
            },
            text: {
                name: 'Text',
                icon: 'P',
                html: `<div style="padding:15px 20px;"><p style="color:#64748b;line-height:1.7;">Your text here. Click to edit.</p></div>`
            },
            image: {
                name: 'Image',
                icon: 'I',
                html: `<div style="padding:20px;text-align:center;background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;cursor:pointer;" onclick="Builder.openImagePicker(this)">
                    <div style="font-size:3rem;">+</div><p>Add Image</p>
                </div>`
            },
            button: {
                name: 'Button',
                icon: 'B',
                html: `<div style="text-align:center;padding:20px;"><a href="#" style="display:inline-block;padding:14px 30px;background:#6366f1;color:white;border-radius:8px;font-weight:600;">Click Here</a></div>`
            },
            features: {
                name: 'Features',
                icon: 'F',
                html: `<div style="padding:40px 20px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
                    <div style="text-align:center;padding:20px;background:#f8fafc;border-radius:10px;"><h4>Feature 1</h4><p style="color:#64748b;font-size:0.85rem;">Description</p></div>
                    <div style="text-align:center;padding:20px;background:#f8fafc;border-radius:10px;"><h4>Feature 2</h4><p style="color:#64748b;font-size:0.85rem;">Description</p></div>
                    <div style="text-align:center;padding:20px;background:#f8fafc;border-radius:10px;"><h4>Feature 3</h4><p style="color:#64748b;font-size:0.85rem;">Description</p></div>
                </div>`
            },
            contact: {
                name: 'Contact Form',
                icon: 'C',
                html: `<div style="padding:40px 20px;max-width:450px;margin:0 auto;">
                    <h2 style="text-align:center;margin-bottom:20px;">Contact Us</h2>
                    <form onsubmit="event.preventDefault();Toast.success('Message sent!');" style="display:flex;flex-direction:column;gap:10px;">
                        <input placeholder="Name" style="padding:10px;border:1px solid #e2e8f0;border-radius:6px;">
                        <input placeholder="Email" style="padding:10px;border:1px solid #e2e8f0;border-radius:6px;">
                        <textarea placeholder="Message" rows="3" style="padding:10px;border:1px solid #e2e8f0;border-radius:6px;"></textarea>
                        <button style="padding:12px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;">Send</button>
                    </form>
                </div>`
            },
            youtube: {
                name: 'YouTube',
                icon: 'Y',
                html: `<div style="padding:20px;max-width:700px;margin:0 auto;">
                    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;">
                        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen></iframe>
                    </div>
                </div>`
            },
            social: {
                name: 'Social Links',
                icon: 'S',
                html: `<div style="padding:20px;text-align:center;display:flex;justify-content:center;gap:16px;flex-wrap:wrap;">
                    <a href="#" style="width:44px;height:44px;background:#1877F2;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-weight:700;font-size:0.8rem;">FB</a>
                    <a href="#" style="width:44px;height:44px;background:#E4405F;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-weight:700;font-size:0.8rem;">IG</a>
                    <a href="#" style="width:44px;height:44px;background:#26A5E4;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-weight:700;font-size:0.8rem;">TG</a>
                </div>`
            }
        };
    },
    
    setupDragDrop() {
        document.querySelectorAll('.builder-block-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.block);
            });
        });
    },
    
    setupCanvas() {
        this.canvas.addEventListener('dragover', (e) => e.preventDefault());
        
        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const blockType = e.dataTransfer.getData('text/plain');
            if (blockType && this.blocks[blockType]) {
                this.addBlock(blockType);
            }
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.deselectAll();
            }
        });
    },
    
    addBlock(type) {
        this.hideEmptyState();
        
        const wrapper = document.createElement('div');
        wrapper.className = 'builder-block';
        wrapper.dataset.type = type;
        wrapper.draggable = true;
        wrapper.innerHTML = this.blocks[type].html;
        
        const toolbar = document.createElement('div');
        toolbar.className = 'builder-block-toolbar';
        toolbar.innerHTML = `
            <button onclick="Builder.editBlock(this.closest('.builder-block'))" title="Edit">Edit</button>
            <button onclick="Builder.moveBlock(this.closest('.builder-block'), 'up')" title="Move Up">Up</button>
            <button onclick="Builder.moveBlock(this.closest('.builder-block'), 'down')" title="Move Down">Down</button>
            <button onclick="Builder.deleteBlock(this.closest('.builder-block'))" title="Delete">X</button>
        `;
        wrapper.appendChild(toolbar);
        
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectBlock(wrapper);
        });
        
        wrapper.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'reorder');
        });
        
        wrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.style.borderColor = '#10b981';
        });
        
        wrapper.addEventListener('dragleave', () => {
            wrapper.style.borderColor = 'transparent';
        });
        
        wrapper.addEventListener('drop', (e) => {
            e.stopPropagation();
            wrapper.style.borderColor = 'transparent';
        });
        
        this.canvas.appendChild(wrapper);
        this.selectBlock(wrapper);
        Toast.success('Block added');
    },
    
    selectBlock(block) {
        this.deselectAll();
        block.classList.add('selected');
        this.selectedBlock = block;
    },
    
    deselectAll() {
        document.querySelectorAll('.builder-block.selected').forEach(b => b.classList.remove('selected'));
        this.selectedBlock = null;
    },
    
    editBlock(block) {
        this.selectBlock(block);
        
        if (block.dataset.type === 'youtube') {
            const iframe = block.querySelector('iframe');
            const newUrl = prompt('YouTube video URL:', iframe?.src);
            if (newUrl && iframe) {
                let videoId = newUrl;
                if (newUrl.includes('v=')) videoId = newUrl.split('v=')[1].split('&')[0];
                else if (newUrl.includes('youtu.be/')) videoId = newUrl.split('youtu.be/')[1].split('?')[0];
                else if (newUrl.includes('embed/')) videoId = newUrl.split('embed/')[1].split('?')[0];
                iframe.src = 'https://www.youtube.com/embed/' + videoId;
            }
            return;
        }
        
        if (block.dataset.type === 'social') {
            const links = block.querySelectorAll('a');
            links.forEach(link => {
                const newUrl = prompt('Social link URL:', link.href);
                if (newUrl) link.href = newUrl;
            });
            return;
        }
        
        const editables = block.querySelectorAll('h1, h2, h3, h4, p, a, button');
        editables.forEach(el => {
            el.contentEditable = 'true';
            el.style.outline = '1px dashed #6366f1';
            el.focus();
            el.addEventListener('blur', function() {
                this.contentEditable = 'false';
                this.style.outline = 'none';
            }, { once: true });
        });
    },
    
    deleteBlock(block) {
        if (confirm('Remove this block?')) {
            block.style.opacity = '0';
            block.style.transform = 'scale(0.95)';
            block.style.transition = 'all 0.3s';
            setTimeout(() => {
                block.remove();
                if (this.canvas.children.length === 0) this.showEmptyState();
                Toast.success('Block removed');
            }, 300);
        }
    },
    
    moveBlock(block, direction) {
        const sibling = direction === 'up' ? block.previousElementSibling : block.nextElementSibling;
        if (sibling) {
            direction === 'up' ? this.canvas.insertBefore(block, sibling) : this.canvas.insertBefore(sibling, block);
            Toast.success('Block moved');
        }
    },
    
    openImagePicker(container) {
        window.selectedImageContainer = container;
        window.open('image-picker.html', 'ImagePicker', 'width=800,height=600');
    },
    
    insertImage(url) {
        if (window.selectedImageContainer) {
            window.selectedImageContainer.innerHTML = `
                <div style="padding:20px;text-align:center;">
                    <img src="${url}" style="max-width:100%;border-radius:8px;" alt="Image">
                </div>`;
            window.selectedImageContainer = null;
            Toast.success('Image added');
        }
    },
    
    hideEmptyState() {
        if (this.emptyState) this.emptyState.style.display = 'none';
    },
    
    showEmptyState() {
        if (this.emptyState) this.emptyState.style.display = 'flex';
    },
    
    save() {
        const siteName = this.siteNameInput?.value || 'my-site';
        Storage.saveSite(siteName, this.canvas.innerHTML);
        Toast.success('Site saved');
    },
    
    loadSavedSite() {
        const siteName = this.siteNameInput?.value || 'my-site';
        const content = localStorage.getItem('wb_site_' + siteName);
        if (content) {
            this.canvas.innerHTML = content;
            this.hideEmptyState();
        }
    },
    
    preview() {
        const siteName = this.siteNameInput?.value || 'my-site';
        const content = this.canvas.innerHTML;
        const win = window.open('', '_blank');
        win.document.write(`
            <!DOCTYPE html><html><head><meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${siteName}</title>
            <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Inter',sans-serif;}</style>
            </head><body>${content.replace(/<div class="builder-block-toolbar".*?<\/div>/g, '')}</body></html>
        `);
    },
    
    publish() {
        this.save();
        const siteName = this.siteNameInput?.value || 'my-site';
        window.location.href = 'publish.html?site=' + encodeURIComponent(siteName);
    }
};

document.addEventListener('DOMContentLoaded', () => Builder.init());
