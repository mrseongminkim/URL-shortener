const block_size = 100;

let current_count;
let remaining_counts = 0;

async function get_count() {
    if (!remaining_counts) {
        const doc = await db.getDb().collection('URL').findById('url_count');
        current_count = doc.count;
        remaining_counts = block_size;
        doc.count += block_size;
        await doc.save();
    }
    remaining_counts--;
    return current_count++;
}

module.exports = {get_count: get_count};